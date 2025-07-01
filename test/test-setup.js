const { OpenAI } = require("openai");
const logger = require("../src/utils/logger");

console.log("🧪 Testing Discord Voice AI Bot components...\n");

console.log("1. Testing environment variables...");
if (
  process.env.DISCORD_TOKEN &&
  process.env.DISCORD_TOKEN !== "your_discord_bot_token_here"
) {
  console.log("   ✅ DISCORD_TOKEN is set");
} else {
  console.log("   ❌ DISCORD_TOKEN not configured");
}

if (
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
) {
  console.log("   ✅ OPENAI_API_KEY is set");
} else {
  console.log("   ❌ OPENAI_API_KEY not configured");
}

console.log("\n2. Testing logger...");
try {
  logger.info("Test log message");
  console.log("   ✅ Logger working");
} catch (error) {
  console.log("   ❌ Logger error:", error.message);
}

console.log("\n3. Testing OpenAI connection...");
if (
  process.env.OPENAI_API_KEY &&
  process.env.OPENAI_API_KEY !== "your_openai_api_key_here"
) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    console.log("   ✅ OpenAI client initialized");
  } catch (error) {
    console.log("   ❌ OpenAI error:", error.message);
  }
} else {
  console.log("   ⏩ Skipped (API key not configured)");
}

console.log("\n4. Testing Discord.js modules...");
try {
  const { Client, GatewayIntentBits } = require("discord.js");
  const { joinVoiceChannel } = require("@discordjs/voice");
  console.log("   ✅ Discord.js modules loaded");
} catch (error) {
  console.log("   ❌ Discord.js error:", error.message);
}

console.log("\n5. Testing required directories...");
const fs = require("fs");

if (fs.existsSync("./logs")) {
  console.log("   ✅ logs/ directory exists");
} else {
  console.log("   ❌ logs/ directory missing");
}

if (fs.existsSync("./temp")) {
  console.log("   ✅ temp/ directory exists");
} else {
  console.log("   ❌ temp/ directory missing");
}

console.log("\n🎉 Component test complete!");
console.log("\n📋 Next steps:");
console.log("1. Configure your .env file with valid tokens");
console.log('2. Run "npm run deploy" to register commands');
console.log('3. Run "npm run dev" to start the bot');
