require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Initialize Gemini AI
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const geminiTimeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || "30000", 10);

let genAI;

if (geminiApiKey) {
  genAI = new GoogleGenAI({ apiKey: geminiApiKey });
  console.log("✓ Gemini API initialized");
} else {
  console.warn("⚠️ GEMINI_API_KEY not found");
}

/**
 * Simple test endpoint
 */
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/**
 * Simple chat endpoint - test Gemini only
 */
app.post("/api/chat", async (req, res) => {
  try {
    console.log("📥 Received request to /api/chat");
    const { message } = req.body;
    console.log("Message received:", message);

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    if (!genAI) {
      return res.json({
        message,
        response: "Gemini API not initialized",
        source: "Error",
      });
    }

    console.log("🔄 Calling Gemini API...");

    const contextPrompt = `You are a helpful chatbot for Dewan VS Group of Institutions.
User Question: "${message}"
Provide a helpful response (keep it concise):`;

    // Create timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Gemini API timeout after ${geminiTimeoutMs}ms`));
      }, geminiTimeoutMs);
    });

    // Create API call promise
    const apiPromise = genAI.models.generateContent({
      model: geminiModel,
      contents: contextPrompt,
      config: {
        temperature: 0.4,
        topP: 0.95,
      },
    });

    // Race between API call and timeout
    const response = await Promise.race([apiPromise, timeoutPromise]);

    // Extract text from response
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

    console.log("✓ Gemini response received");

    res.json({
      message,
      response: answer,
      source: "Gemini AI",
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({
      error: "An error occurred",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// Start server - listen on all interfaces
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Health: http://localhost:${PORT}/health`);
  console.log(`📡 Chat API: http://localhost:${PORT}/api/chat`);
});

module.exports = app;
