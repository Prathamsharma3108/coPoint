const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function testMyCode() {
  console.log("🚀 Testing with standard 'gemini-pro'...");
  
  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ Error: No API Key found in .env.local");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  // FIX: Using the standard reliable model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  try {
    const result = await model.generateContent("Generate a HTML button. Return only code.");
    console.log("\n✅ SUCCESS! AI Response:\n", result.response.text());
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    console.log("⚠️ If this fails, your API Key is invalid. Generate a new one at aistudio.google.com");
  }
}
testMyCode();
