const OpenAI = require("openai");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async transcribeAudio(audioBuffer) {
    try {
      // save buffer to temporary file for openai api
      const tempPath = path.join(
        __dirname,
        "../../temp",
        `audio_${Date.now()}.wav`
      );

      const tempDir = path.dirname(tempPath);
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      fs.writeFileSync(tempPath, audioBuffer);
      const transcription = await this.client.audio.transcriptions.create({
        file: fs.createReadStream(tempPath),
        model: "gpt-4o-mini-transcribe",
        language: "en",
      });

      fs.unlinkSync(tempPath);

      return transcription.text;
    } catch (error) {
      logger.error("Error transcribing audio:", error);
      throw error;
    }
  }

  async generateResponse(messages) {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant in a Discord voice channel. Keep responses conversational, friendly, and concise (1-2 sentences). Respond as if you're speaking naturally to someone.",
          },
          ...messages,
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error("Error generating response:", error);
      throw error;
    }
  }

  async synthesizeSpeech(text) {
    try {
      const mp3 = await this.client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
        speed: 1.0,
      });

      const buffer = Buffer.from(await mp3.arrayBuffer());
      return buffer;
    } catch (error) {
      logger.error("Error synthesizing speech:", error);
      throw error;
    }
  }
}

module.exports = OpenAIService;
