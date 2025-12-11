require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");
const NLPManager = require("./services/nlpManager");

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize NLP Manager
const nlpManager = new NLPManager();

// Initialize Gemini AI
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const geminiTimeoutMs = parseInt(process.env.GEMINI_TIMEOUT_MS || "15000", 10);
let genAI;

if (geminiApiKey) {
  genAI = new GoogleGenAI({
    apiKey: geminiApiKey,
    apiVersion: process.env.GEMINI_API_VERSION || "v1",
  });
}

/**
 * Initialize the chatbot on server startup
 */
async function initializeChatbot() {
  try {
    console.log("Starting chatbot initialization...");
    await nlpManager.trainModel();
    console.log("✓ NLP Model trained successfully");
  } catch (error) {
    console.error("Failed to initialize chatbot:", error);
    process.exit(1);
  }
}

/**
 * Get answer from Gemini AI as fallback
 */
async function getGeminiResponse(userInput, intentName) {
  try {
    if (!genAI) {
      console.warn(
        "⚠️ Gemini API not initialized - GEMINI_API_KEY not found in .env"
      );
      return {
        answer:
          "I can't access my AI engine right now. Please check back later or contact support.",
        source: "Error",
      };
    }

    const contextPrompt = `You are a helpful and professional chatbot for Dewan VS Group of Institutions, a premier educational institution in India.

Provide accurate, concise, and helpful answers about the college's:
- Admission processes and eligibility
- Courses offered (BCA, MCA, B-Tech, MBA, etc.)
- Faculty and departments
- Fee structures and scholarships
- Campus facilities and location
- Placement records
- Student life and activities

If the question is not related to the college, politely redirect the user to college-related topics.

User Question: "${userInput}"

Provide a helpful response (keep it concise):`;

    const geminiCall = genAI.models.generateContent({
      model: geminiModel,
      contents: [
        {
          role: "user",
          parts: [{ text: contextPrompt }],
        },
      ],
      config: {
        temperature: 0.4,
        topP: 0.95,
      },
    });

    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error(`Gemini API timeout after ${geminiTimeoutMs}ms`));
      }, geminiTimeoutMs);
    });

    const response = await Promise.race([geminiCall, timeoutPromise]);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const answer = response?.text?.trim();

    if (!answer) {
      throw new Error("No response from Gemini API");
    }

    return {
      answer,
      source: "Gemini AI",
    };
  } catch (error) {
    const errorMessage = error?.message || "Unknown Gemini error";
    console.error(
      `❌ Gemini API Error${intentName ? ` for intent ${intentName}` : ""}:`,
      errorMessage
    );
    return {
      answer:
        "I encountered an issue generating a response. Please try asking about admissions, courses, fees, or campus facilities instead.",
      source: "Error",
    };
  }
}

/**
 * Chat endpoint - handles user messages
 */
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({
        error: "Message cannot be empty",
      });
    }

    // Get NLP classification
    const nlpResult = await nlpManager.classify(message);

    let response;
    let source;
    let confidence = nlpResult.confidence;
    let intent = nlpResult.intent;

    // Debug logging
    console.log(
      `📝 Query: "${message}" | Intent: ${intent} | Confidence: ${(
        confidence * 100
      ).toFixed(1)}%`
    );

    // Use local NLP response only if confidence is high AND response exists
    if (nlpResult.confidence >= 0.75 && nlpResult.response) {
      response = nlpResult.response;
      source = "Local Bot";
      console.log(`✓ Using Local Bot response`);
    } else {
      // Use Gemini AI for low confidence or missing responses
      console.log(
        `🔄 Triggering Gemini AI fallback (confidence: ${(
          confidence * 100
        ).toFixed(1)}%)`
      );
      const geminiResult = await getGeminiResponse(message, intent);

      if (geminiResult && geminiResult.answer) {
        response = geminiResult.answer;
        source = geminiResult.source;
        console.log(`✓ Gemini response received from ${source}`);
      } else {
        // Fallback response if Gemini fails
        response =
          "I'm unable to generate a response right now. Please try asking about admissions, courses, or campus facilities.";
        source = "Error";
        confidence = 0;
      }
    }

    res.json({
      message,
      response,
      source,
      confidence: confidence,
      intent: nlpResult.intent,
    });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "An error occurred while processing your message",
      details: error.message,
    });
  }
});

/**
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    nlpTrained: nlpManager.isTrained(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * Get supported intents
 */
app.get("/api/intents", (req, res) => {
  try {
    const intents = Object.keys(nlpManager.manager.responses || {});
    res.json({
      intents,
      count: intents.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve intents",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);

  // Initialize chatbot after server starts
  initializeChatbot()
    .then(() => {
      console.log("✓ Chatbot initialized and ready!");
    })
    .catch((err) => {
      console.error("Failed to initialize chatbot:", err);
    });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = app;
