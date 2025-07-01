const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

class DiscordClient extends Client {
  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.commands = new Collection();
    this.voiceConnections = new Map();

    this.loadCommands();
    this.loadEvents();
    this.login();
  }
  loadCommands() {
    const commandsPath = path.join(__dirname, "../commands");
    const commandFolders = fs.readdirSync(commandsPath);

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(path.join(commandsPath, folder))
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, folder, file);
        const command = require(filePath);

        if ("data" in command && "execute" in command) {
          this.commands.set(command.data.name, command);
          logger.info(`Loaded command: ${command.data.name}`);
        }
      }
    }
  }

  loadEvents() {
    const eventsPath = path.join(__dirname, "../events");
    const eventFiles = fs
      .readdirSync(eventsPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);

      if (event.once) {
        this.once(event.name, (...args) => event.execute(...args));
      } else {
        this.on(event.name, (...args) => event.execute(...args));
      }

      logger.info(`Loaded event: ${event.name}`);
    }
  }

  async login() {
    try {
      await super.login(process.env.DISCORD_TOKEN);
      logger.info("Discord bot logged in successfully");
    } catch (error) {
      logger.error("Failed to login to Discord:", error);
      process.exit(1);
    }
  }
}

module.exports = { Client: DiscordClient };
