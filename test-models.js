require("dotenv").config();
const OpenAI = require("openai");

async function testNewModels() {
  try {
    console.log("🧪 Testing new OpenAI models...");

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Test GPT-4o-mini for chat
    console.log("\n1. Testing gpt-4o-mini for chat...");
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: 'Say "GPT-4o-mini is working!"' }],
      max_tokens: 20,
    });
    console.log(
      "✅ GPT-4o-mini response:",
      chatResponse.choices[0].message.content
    );

    // Test TTS model
    console.log("\n2. Testing gpt-4o-mini-tts...");
    try {
      const ttsResponse = await openai.audio.speech.create({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: "Testing TTS functionality",
        speed: 1.0,
      });
      console.log(
        "✅ TTS model working, response size:",
        (await ttsResponse.arrayBuffer()).byteLength,
        "bytes"
      );
    } catch (ttsError) {
      console.log("❌ TTS model failed:", ttsError.message);
      console.log("   Falling back to standard tts-1 model");
    }

    // Note: We can't easily test transcription without an audio file
    console.log(
      "\n3. Transcription model will be tested when audio is processed"
    );
  } catch (error) {
    console.log("❌ Model test failed:", error.message);
    if (error.status) {
      console.log(`   Status: ${error.status}`);
    }
  }
}

testNewModels();
