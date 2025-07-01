require("dotenv").config();

console.log("🔍 Environment Variables Check:");
console.log("================================");

// Check if variables exist (without showing full values for security)
const discordToken = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;
const guildId = process.env.DISCORD_GUILD_ID;
const openaiKey = process.env.OPENAI_API_KEY;

console.log(
  `DISCORD_TOKEN: ${
    discordToken
      ? "✅ Set (" + discordToken.substring(0, 10) + "...)"
      : "❌ Missing"
  }`
);
console.log(
  `DISCORD_CLIENT_ID: ${clientId ? "✅ Set (" + clientId + ")" : "❌ Missing"}`
);
console.log(
  `DISCORD_GUILD_ID: ${guildId ? "✅ Set (" + guildId + ")" : "❌ Missing"}`
);
console.log(
  `OPENAI_API_KEY: ${
    openaiKey ? "✅ Set (" + openaiKey.substring(0, 15) + "...)" : "❌ Missing"
  }`
);

console.log("\n🔧 Issues Found:");

if (!discordToken || discordToken === "your_discord_bot_token_here") {
  console.log("❌ Discord token not configured properly");
}

if (!clientId || clientId === "your_bot_client_id_here") {
  console.log("❌ Discord client ID not configured properly");
}

if (!guildId || guildId === "your_test_guild_id_here") {
  console.log(
    "❌ Discord guild ID not configured - this is required for command deployment"
  );
  console.log("   To get your guild ID:");
  console.log("   1. Enable Developer Mode in Discord settings");
  console.log('   2. Right-click your server name → "Copy Server ID"');
}

if (!openaiKey || openaiKey === "your_openai_api_key_here") {
  console.log("❌ OpenAI API key not configured properly");
}

// Check if token format looks correct
if (discordToken && !discordToken.startsWith("MTM")) {
  console.log(
    "⚠️  Discord token format looks unusual (should start with letters/numbers)"
  );
}

if (clientId && clientId.length !== 19) {
  console.log("⚠️  Discord client ID should be 19 digits long");
}

if (guildId && guildId !== "your_test_guild_id_here" && guildId.length !== 19) {
  console.log("⚠️  Discord guild ID should be 19 digits long");
}

console.log("\n📋 Next Steps:");
console.log("1. Update your .env file with correct values");
console.log('2. Run "npm run deploy" to register commands');
console.log('3. Run "npm run dev" to start the bot');
