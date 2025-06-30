module.exports = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
  password: process.env.REDIS_PASSWORD || null,

  options: {
    retryDelayOnFailover: 100,
    enableReadyCheck: false,
    maxRetriesPerRequest: 3,
  },

  keyPrefixes: {
    conversation: "conv:",
    user: "user:",
    guild: "guild:",
    temp: "temp:",
  },

  ttl: {
    conversation: 900,
    temp: 60,
    user: 3600,
  },
};
