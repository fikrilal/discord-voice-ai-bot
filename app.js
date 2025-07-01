/**
 * discord voice ai bot - main application entry point
 * @author fikril - fikril.dev
 */
require("dotenv").config();
const express = require("express");
const { Client } = require("./src/bot");
const logger = require("./src/utils/logger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// health check endpoint for monitoring
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

const bot = new Client();

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// graceful shutdown handlers
process.on("SIGINT", () => {
  logger.info("Received SIGINT, shutting down gracefully");
  bot.destroy();
  process.exit(0);
});

process.on("SIGTERM", () => {
  logger.info("Received SIGTERM, shutting down gracefully");
  bot.destroy();
  process.exit(0);
});

module.exports = app;
