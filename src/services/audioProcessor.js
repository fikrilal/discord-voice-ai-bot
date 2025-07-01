const ffmpeg = require("fluent-ffmpeg");
const { Readable } = require("stream");
const logger = require("../utils/logger");

class AudioProcessor {
  constructor() {
    // configure ffmpeg path if needed on windows
    // ffmpeg.setFfmpegPath('path/to/ffmpeg.exe');
  }

  async pcmToWav(pcmBuffer, sampleRate = 48000, channels = 2, bitDepth = 16) {
    return new Promise((resolve, reject) => {
      const chunks = [];

      const readable = new Readable({
        read() {},
      });

      readable.push(pcmBuffer);
      readable.push(null);

      ffmpeg(readable)
        .inputFormat("s16le")
        .inputOptions([`-ar ${sampleRate}`, `-ac ${channels}`])
        .audioCodec("pcm_s16le")
        .format("wav")
        .on("error", (error) => {
          logger.error("PCM to WAV conversion error:", error);
          reject(error);
        })
        .on("end", () => {
          resolve(Buffer.concat(chunks));
        })
        .pipe()
        .on("data", (chunk) => {
          chunks.push(chunk);
        });
    });
  }

  async mp3ToPcm(mp3Buffer, sampleRate = 48000, channels = 2) {
    return new Promise((resolve, reject) => {
      const chunks = [];

      const readable = new Readable({
        read() {},
      });

      readable.push(mp3Buffer);
      readable.push(null);

      ffmpeg(readable)
        .inputFormat("mp3")
        .audioCodec("pcm_s16le")
        .audioChannels(channels)
        .audioFrequency(sampleRate)
        .format("s16le")
        .on("error", (error) => {
          logger.error("MP3 to PCM conversion error:", error);
          reject(error);
        })
        .on("end", () => {
          resolve(Buffer.concat(chunks));
        })
        .pipe()
        .on("data", (chunk) => {
          chunks.push(chunk);
        });
    });
  }

  async normalizeAudio(audioBuffer, targetVolume = 0.5) {
    return new Promise((resolve, reject) => {
      const chunks = [];

      const readable = new Readable({
        read() {},
      });

      readable.push(audioBuffer);
      readable.push(null);

      ffmpeg(readable)
        .audioFilters(`volume=${targetVolume}`)
        .format("s16le")
        .on("error", (error) => {
          logger.error("Audio normalization error:", error);
          reject(error);
        })
        .on("end", () => {
          resolve(Buffer.concat(chunks));
        })
        .pipe()
        .on("data", (chunk) => {
          chunks.push(chunk);
        });
    });
  }
  isValidAudio(audioBuffer, minDuration = 0.5) {
    const minBytes = Math.floor(48000 * 2 * 2 * minDuration);
    return audioBuffer && audioBuffer.length >= minBytes;
  }

  detectVoiceActivity(audioBuffer, threshold = 1000, windowSize = 1024) {
    if (!audioBuffer || audioBuffer.length < windowSize * 2) {
      return false;
    }

    // convert buffer to 16-bit samples for analysis
    const samples = new Int16Array(
      audioBuffer.buffer,
      audioBuffer.byteOffset,
      audioBuffer.byteLength / 2
    );

    // analyze rms energy across audio windows
    let voiceWindows = 0;
    const totalWindows = Math.floor(samples.length / windowSize);

    for (let i = 0; i < samples.length - windowSize; i += windowSize) {
      let sum = 0;
      for (let j = i; j < i + windowSize && j < samples.length; j++) {
        sum += samples[j] * samples[j];
      }

      const rms = Math.sqrt(sum / windowSize);

      if (rms > threshold) {
        voiceWindows++;
      }
    }

    // require at least 20% voice activity to be valid speech
    const voiceRatio = voiceWindows / totalWindows;
    logger.info(
      `Voice activity: ${voiceWindows}/${totalWindows} windows (${(
        voiceRatio * 100
      ).toFixed(1)}%)`
    );

    return voiceRatio > 0.2;
  }
}

module.exports = AudioProcessor;
