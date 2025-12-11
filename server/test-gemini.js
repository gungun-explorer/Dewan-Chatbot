require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key exists:", !!apiKey);

const ai = new GoogleGenAI({ apiKey });

async function test() {
  try {
    console.log("Starting API call...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello, what is 2+2?",
    });
    console.log("Response received:", response.text);
  } catch (error) {
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
}

test()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });

// Timeout after 30 seconds
setTimeout(() => {
  console.error("TIMEOUT - process did not complete within 30 seconds");
  process.exit(1);
}, 30000);
