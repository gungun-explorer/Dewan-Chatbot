const { GoogleGenAI } = require("@google/genai");

// Creates and configures a Gemini client
// these are imported from environment variables from env.js

function createGeminiClient({
  apiKey,
  model,
  apiVersion,
  timeoutMs,
  systemInstruction,
}) {
  if (!apiKey) {
    return {
      isConfigured: false,
      async getResponse() {
        return {
          answer:
            "I can't access my AI engine right now. Please try again later or contact support.",
          source: "Error",
        };
      },
    };
  }

  const genAI = new GoogleGenAI({ apiKey, apiVersion });

  async function getResponse(userInput, intentName) {
    try {
      const contextPrompt = `${systemInstruction}\n\nUser Question: "${userInput}"`;

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Gemini API timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      const apiPromise = genAI.models.generateContent({
        model,
        contents: contextPrompt,
        config: {
          temperature: 0.4,
          topP: 0.95,
        },
      });

      const response = await Promise.race([apiPromise, timeoutPromise]);

      let answer = response?.text;

      if (!answer && response?.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        if (candidate?.content?.parts && candidate.content.parts.length > 0) {
          answer = candidate.content.parts[0]?.text;
        }
      }

      answer = answer?.trim();

      if (!answer) {
        throw new Error("No response text from Gemini API");
      }

      return {
        answer,
        source: "Gemini AI",
      };
    } catch (error) {
      const message = error?.message || "Unknown Gemini error";
      console.error(
        `❌ Gemini API Error${intentName ? ` for intent ${intentName}` : ""}:`,
        message
      );
      return {
        answer:
          "I encountered an issue generating a response. Please try asking about admissions, courses, fees, or campus facilities instead.",
        source: "Error",
      };
    }
  }

  return {
    isConfigured: true,
    getResponse,
  };
}

module.exports = { createGeminiClient };
