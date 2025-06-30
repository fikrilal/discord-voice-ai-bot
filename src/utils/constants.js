module.exports = {
  // audio processing configuration
  AUDIO: {
    SAMPLE_RATE: 48000,
    CHANNELS: 2,
    BIT_DEPTH: 16,
    MAX_DURATION: 30000,
    MIN_DURATION: 200,
    SILENCE_THRESHOLD: 2000,
    VOICE_THRESHOLD: 1000,
  },

  // voice connection settings
  VOICE: {
    CONNECTION_TIMEOUT: 30000,
    RECONNECT_ATTEMPTS: 3,
    AUTO_LEAVE_TIMEOUT: 300000,
  },

  // openai api configuration
  OPENAI: {
    MAX_TOKENS: 150,
    TEMPERATURE: 0.7,
    TTS_VOICE: "alloy",
    TTS_SPEED: 1.0,
    WHISPER_MODEL: "whisper-1",
    GPT_MODEL: "gpt-4o-mini",
  },

  // Conversation settings
  CONVERSATION: {
    MAX_HISTORY: 10,
    TIMEOUT: 900000,
    CONTEXT_WINDOW: 5, // last 5 messages
  },

  // Bot settings
  BOT: {
    ACTIVITY_TYPE: "LISTENING",
    ACTIVITY_NAME: "AI Voice Chat",
    STATUS: "online",
  },

  // Error messages
  ERRORS: {
    NO_VOICE_CHANNEL: "You need to be in a voice channel first!",
    NOT_IN_VOICE: "I'm not in a voice channel!",
    PROCESSING_ERROR: "Sorry, I had trouble processing that. Please try again.",
    CONNECTION_FAILED: "Failed to connect to voice channel.",
    AUDIO_PROCESSING_FAILED: "Failed to process audio.",
    API_ERROR: "AI service is temporarily unavailable.",
  },

  // Success messages
  SUCCESS: {
    JOINED_VOICE: "Joined voice channel! I'm ready to chat.",
    LEFT_VOICE: "Left the voice channel. See you later!",
    LISTENING: "I'm listening. Start speaking!",
  },
};
