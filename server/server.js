const createApp = require("./app");
const NLPManager = require("./services/nlpManager");
const { createGeminiClient } = require("./services/geminiService");
const {
  NODE_ENV,
  PORT,
  FRONTEND_URL,
  NLP_CONFIDENCE_THRESHOLD,
  GEMINI,
  SYSTEM_INSTRUCTION,
} = require("./config/env");

const nlpManager = new NLPManager();

const geminiClient = createGeminiClient({
  apiKey: GEMINI.apiKey,
  model: GEMINI.model,
  apiVersion: GEMINI.apiVersion,
  timeoutMs: GEMINI.timeoutMs,
  systemInstruction: SYSTEM_INSTRUCTION,
});

const app = createApp({
  nlpManager,
  geminiClient,
  config: {
    FRONTEND_URL,
    NLP_CONFIDENCE_THRESHOLD,
  },
});

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

const server = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
  console.log(`📡 Environment: ${NODE_ENV}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔧 Health check: http://localhost:${PORT}/health`);

  initializeChatbot()
    .then(() => console.log("✓ Chatbot initialized and ready!"))
    .catch((err) => {
      console.error("Failed to initialize chatbot:", err);
      if (NODE_ENV !== "production") {
        process.exit(1);
      }
    });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

module.exports = app;
