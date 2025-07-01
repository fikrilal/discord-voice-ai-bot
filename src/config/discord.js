module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,

  intents: ["Guilds", "GuildMessages", "GuildVoiceStates", "MessageContent"],

  voice: {
    timeout: parseInt(process.env.VOICE_TIMEOUT) || 300000,
    maxDuration: parseInt(process.env.MAX_AUDIO_DURATION) || 30000,
    autoLeave: true,
    autoLeaveTimeout: 30000,
  },

  activity: {
    name: "AI Voice Chat",
    type: "LISTENING",
  },
};
