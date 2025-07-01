require("dotenv").config();
const OpenAI = require("openai");

async function testOpenAI() {
  try {
    console.log("🧪 Testing OpenAI connection...");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: 'Say "Hello, Discord bot test successful!"' },
      ],
      max_tokens: 20,
    });

    console.log("✅ OpenAI connection successful!");
    console.log("   Response:", completion.choices[0].message.content);
  } catch (error) {
    console.log("❌ OpenAI test failed:", error.message);
    if (error.status) {
      console.log(`   Status: ${error.status}`);
    }
  }
}

testOpenAI();
