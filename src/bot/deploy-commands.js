const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const commands = [];
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
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    if (process.env.DISCORD_GUILD_ID) {
      const data = await rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID,
          process.env.DISCORD_GUILD_ID
        ),
        { body: commands }
      );
      console.log(
        `Successfully reloaded ${data.length} guild application (/) commands.`
      );
    } else {
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commands }
      );
      console.log(
        `Successfully reloaded ${data.length} global application (/) commands.`
      );
    }
  } catch (error) {
    console.error("Error deploying commands:", error);
  }
})();
