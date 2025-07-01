const { SlashCommandBuilder } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leave")
    .setDescription("Leave the voice channel"),

  async execute(interaction) {
    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return interaction.reply({
        content: "❌ I'm not in a voice channel!",
        ephemeral: true,
      });
    }

    try {
      connection.destroy();
      interaction.client.voiceConnections.delete(interaction.guild.id);

      await interaction.reply({
        content: "👋 Left the voice channel. See you later!",
        ephemeral: false,
      });
    } catch (error) {
      console.error("Error leaving voice channel:", error);
      await interaction.reply({
        content: "❌ Failed to leave voice channel.",
        ephemeral: true,
      });
    }
  },
};
