module.exports = {
  apiKey: process.env.OPENAI_API_KEY,
  models: {
    chat: "gpt-4o-mini",
    transcribe: "gpt-4o-mini-transcribe",
    tts: "gpt-4o-mini-tts",
  },

  chat: {
    maxTokens: 150,
    temperature: 0.7,
    systemPrompt:
      "You are a helpful AI assistant in a Discord voice channel. Keep responses conversational, friendly, and concise (1-2 sentences). Respond as if you're speaking naturally to someone.",
  },
  tts: {
    voice: "alloy",
    speed: 1.0,
    model: "gpt-4o-mini-tts",
  },

  transcribe: {
    language: "en",
    temperature: 0,
    model: "gpt-4o-mini-transcribe",
  },

  limits: {
    maxRequestsPerMinute: 60,
    maxTokensPerDay: 10000,
  },
};
