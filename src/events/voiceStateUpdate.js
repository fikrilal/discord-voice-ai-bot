const { Events } = require("discord.js");
const { getVoiceConnection } = require("@discordjs/voice");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    const connection = getVoiceConnection(newState.guild.id);

    if (!connection) return; // check if bot was moved or disconnected
    if (
      newState.member.user.bot &&
      newState.member.user.id === newState.client.user.id
    ) {
      if (!newState.channelId) {
        // bot was disconnected
        connection.destroy();
        newState.client.voiceConnections.delete(newState.guild.id);
        console.log("Bot was disconnected from voice channel");
      }
    }

    // auto-leave if no users in channel
    const voiceChannel = connection.joinConfig.channelId;
    const channel = newState.guild.channels.cache.get(voiceChannel);

    if (channel) {
      const members = channel.members.filter((member) => !member.user.bot);

      if (members.size === 0) {
        setTimeout(() => {
          const currentMembers = channel.members.filter(
            (member) => !member.user.bot
          );
          if (currentMembers.size === 0) {
            connection.destroy();
            newState.client.voiceConnections.delete(newState.guild.id);
            console.log("Auto-left voice channel (no users)");
          }
        }, 30000); // Wait 30 seconds before leaving
      }
    }
  },
};
