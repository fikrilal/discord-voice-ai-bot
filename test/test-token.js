require("dotenv").config();
const { REST } = require("discord.js");

async function testToken() {
  try {
    console.log("🧪 Testing Discord token...");

    const rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN
    );

    const user = await rest.get("/users/@me");
    console.log(`✅ Token valid! Bot: ${user.username}#${user.discriminator}`);
    console.log(`   Bot ID: ${user.id}`);

    if (user.id === process.env.DISCORD_CLIENT_ID) {
      console.log("✅ Client ID matches bot ID");
    } else {
      console.log("❌ Client ID does not match bot ID");
      console.log(`   Expected: ${user.id}`);
      console.log(`   Got: ${process.env.DISCORD_CLIENT_ID}`);
    }
  } catch (error) {
    console.log("❌ Token test failed:", error.message);
    console.log("   Please check your DISCORD_TOKEN in .env file");
  }
}

testToken();
