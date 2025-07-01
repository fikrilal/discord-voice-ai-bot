const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show available commands and bot information"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("🤖 Discord Voice AI Bot")
      .setDescription("AI-powered voice interactions in Discord!")
      .addFields(
        {
          name: "🎙️ Voice Commands",
          value:
            "`/join` - Join your voice channel\n`/leave` - Leave voice channel",
          inline: true,
        },
        {
          name: "🛠️ Utility",
          value: "`/ping` - Check bot latency\n`/help` - Show this help",
          inline: true,
        },
        {
          name: "💡 How to Use",
          value:
            "1. Join a voice channel\n2. Use `/join` command\n3. Start speaking!\n4. I'll respond with AI-generated speech",
          inline: false,
        }
      )
      .setFooter({ text: "Powered by OpenAI" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
