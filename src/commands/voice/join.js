const { SlashCommandBuilder } = require("discord.js");
const { joinVoiceChannel, VoiceConnectionStatus } = require("@discordjs/voice");
const VoiceManager = require("../../services/voiceManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("join")
    .setDescription("Join your voice channel and start AI voice interaction"),

  async execute(interaction) {
    const member = interaction.member;
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({
        content: "❌ You need to be in a voice channel first!",
        ephemeral: true,
      });
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
      }); // store connection for later cleanup
      interaction.client.voiceConnections.set(interaction.guild.id, connection);

      const voiceManager = new VoiceManager(connection, interaction.channel);

      connection.on(VoiceConnectionStatus.Ready, () => {
        console.log("Voice connection is ready!");
      });

      await interaction.reply({
        content: `✅ Joined **${voiceChannel.name}**! I'm ready to chat. Just speak and I'll respond!`,
        ephemeral: false,
      });
    } catch (error) {
      console.error("Error joining voice channel:", error);
      await interaction.reply({
        content: "❌ Failed to join voice channel. Please try again.",
        ephemeral: true,
      });
    }
  },
};
