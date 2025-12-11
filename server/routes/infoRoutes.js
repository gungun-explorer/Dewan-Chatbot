const express = require("express");

module.exports = function infoRoutes({ nlpManager, geminiClient }) {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.json({
      name: "Dewan Chatbot API",
      version: "1.0.0",
      status: "online",
      endpoints: {
        health: "/health",
        chat: "/api/chat",
        intents: "/api/intents",
      },
      documentation: "https://github.com/gungun-explorer/Dewan-Chatbot",
    });
  });

  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      nlpTrained: nlpManager.isTrained(),
      geminiConfigured: geminiClient?.isConfigured || false,
    });
  });

  router.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      nlpTrained: nlpManager.isTrained(),
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/api/intents", (req, res) => {
    try {
      const intents = Object.keys(nlpManager.manager.responses || {});
      res.json({ intents, count: intents.length });
    } catch (error) {
      res.status(500).json({
        error: "Failed to retrieve intents",
        details: error.message,
      });
    }
  });

  return router;
};
