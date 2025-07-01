const {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  EndBehaviorType,
} = require("@discordjs/voice");
const OpenAIService = require("./openaiService");
const ConversationManager = require("./conversationManager");
const AudioProcessor = require("./audioProcessor");
const logger = require("../utils/logger");

class VoiceManager {
  constructor(connection, textChannel) {
    this.connection = connection;
    this.textChannel = textChannel;
    this.openai = new OpenAIService();
    this.conversationManager = new ConversationManager();
    this.audioProcessor = new AudioProcessor();
    this.audioPlayer = createAudioPlayer();
    this.isListening = false;
    this.audioBuffers = new Map();
    this.activeRecordings = new Map(); // track active recording sessions

    this.setupVoiceConnection();
    this.setupAudioReceiver();
  }

  setupVoiceConnection() {
    this.connection.subscribe(this.audioPlayer);

    this.connection.on(VoiceConnectionStatus.Ready, () => {
      logger.info("Voice connection is ready");
      this.startListening();
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, () => {
      logger.info("Voice connection disconnected");
      this.cleanup();
    });

    this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
      logger.info("Audio player started playing");
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      logger.info("Audio player finished playing");
    });
  }
  setupAudioReceiver() {
    this.connection.receiver.speaking.on("start", (userId) => {
      if (this.isListening) {
        logger.info(`User ${userId} started speaking`);
        this.handleUserSpeaking(userId);
      }
    });

    this.connection.receiver.speaking.on("end", (userId) => {
      logger.info(`User ${userId} stopped speaking`);
    });
  }

  startListening() {
    this.isListening = true;
    logger.info("Started listening for voice input");
  }

  stopListening() {
    this.isListening = false;
    logger.info("Stopped listening for voice input");
  }
  handleUserSpeaking(userId) {
    // prevent duplicate recording sessions for same user
    if (this.activeRecordings.has(userId)) {
      return;
    }

    const opusStream = this.connection.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.Manual, // manual control for better audio capture
      },
    });

    // decode OPUS -> PCM (16-bit LE, 48kHz, stereo)
    const prism = require("prism-media");
    const decoder = new prism.opus.Decoder({
      frameSize: 960,
      channels: 2,
      rate: 48000,
    });

    const pcmStream = opusStream.pipe(decoder);

    const chunks = [];
    let lastAudioTime = Date.now();
    const SILENCE_DURATION = 2000;
    const MAX_RECORDING_TIME = 30000;

    // track this recording session with timers
    const recordingSession = {
      audioStream: opusStream,
      decoder,
      chunks,
      silenceTimer: null,
      maxTimer: null,
    };
    this.activeRecordings.set(userId, recordingSession);

    // custom silence detection with timer
    recordingSession.silenceTimer = setInterval(() => {
      const now = Date.now();
      const timeSinceLastAudio = now - lastAudioTime;

      if (timeSinceLastAudio > SILENCE_DURATION) {
        this.finishRecording(userId, "silence");
      }
    }, 100);

    recordingSession.maxTimer = setTimeout(() => {
      this.finishRecording(userId, "timeout");
    }, MAX_RECORDING_TIME);

    pcmStream.on("data", (chunk) => {
      chunks.push(chunk);
      lastAudioTime = Date.now();

      // log progress for long recordings
      if (chunks.length % 50 === 0) {
        const totalBytes = Buffer.concat(chunks).length;
        logger.info(
          `Receiving audio from ${userId}: ${totalBytes} bytes collected`
        );
      }
    });

    pcmStream.on("end", () => {
      this.finishRecording(userId, "ended");
    });

    pcmStream.on("error", (error) => {
      logger.error("PCM stream error:", error);
      this.finishRecording(userId, "error");
    });
  }

  finishRecording(userId, reason) {
    const session = this.activeRecordings.get(userId);
    if (!session) return;

    if (session.silenceTimer) clearInterval(session.silenceTimer);
    if (session.maxTimer) clearTimeout(session.maxTimer);

    if (session.audioStream && !session.audioStream.destroyed) {
      session.audioStream.destroy();
    }

    if (session.chunks.length > 0) {
      const audioBuffer = Buffer.concat(session.chunks);
      logger.info(
        `Finished recording for ${userId} (${reason}): ${audioBuffer.length} bytes`
      );
      this.audioBuffers.set(userId, audioBuffer);
      this.processUserAudio(userId);
    }

    this.activeRecordings.delete(userId);
  }
  async processUserAudio(userId) {
    try {
      const audioBuffer = this.audioBuffers.get(userId);
      this.audioBuffers.delete(userId);

      if (!audioBuffer || audioBuffer.length === 0) {
        return;
      }

      // validate minimum audio length for openai api
      const minDurationMs = 100;
      const bytesPerSecond = 48000 * 2 * 2;
      const minBytes = (bytesPerSecond * minDurationMs) / 1000;

      if (audioBuffer.length < minBytes) {
        logger.info(
          `Audio too short: ${audioBuffer.length} bytes, need at least ${minBytes} bytes`
        );
        return;
      }

      // check if audio contains actual voice activity
      const hasVoice = this.audioProcessor.detectVoiceActivity(audioBuffer);
      if (!hasVoice) {
        logger.info("No voice activity detected in audio");
        return;
      }

      const wavBuffer = await this.audioProcessor.pcmToWav(audioBuffer);

      // additional wav validation for openai api
      if (wavBuffer.length < 1000) {
        logger.info(`WAV file too small: ${wavBuffer.length} bytes`);
        return;
      }

      const transcription = await this.openai.transcribeAudio(wavBuffer);

      if (!transcription || transcription.trim().length === 0) {
        return;
      }

      logger.info(`Transcribed: ${transcription}`);

      const messages = this.conversationManager.getContext(userId);
      messages.push({ role: "user", content: transcription });

      const response = await this.openai.generateResponse(messages);

      this.conversationManager.addMessage(userId, "user", transcription);
      this.conversationManager.addMessage(userId, "assistant", response);

      logger.info(`AI Response: ${response}`);
      await this.speakResponse(response);
      if (this.textChannel) {
        await this.textChannel.send(
          `🎤 **User:** ${transcription}\n🤖 **AI:** ${response}`
        );
      }
    } catch (error) {
      logger.error("Error processing audio:", error);

      if (this.textChannel) {
        await this.textChannel.send(
          "❌ Sorry, I had trouble processing that. Please try again."
        );
      }
    }
  }
  async speakResponse(text) {
    try {
      const audioBuffer = await this.openai.synthesizeSpeech(text);

      // convert mp3 buffer to readable stream for discord
      const { Readable } = require("stream");
      const audioStream = new Readable({
        read() {},
      });
      audioStream.push(audioBuffer);
      audioStream.push(null);

      const resource = createAudioResource(audioStream, {
        inputType: "arbitrary",
        inlineVolume: true,
      });

      resource.volume.setVolume(0.5);
      this.audioPlayer.play(resource);
    } catch (error) {
      logger.error("Error speaking response:", error);
    }
  }
  cleanup() {
    this.stopListening();
    this.audioBuffers.clear();
    this.conversationManager.cleanup();

    // cleanup active recording sessions and timers
    if (this.activeRecordings) {
      this.activeRecordings.clear();
    }
  }
}

module.exports = VoiceManager;
