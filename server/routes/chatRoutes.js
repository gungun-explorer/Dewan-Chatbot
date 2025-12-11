const express = require("express");

module.exports = function chatRoutes({ nlpManager, geminiClient, config }) {
  const router = express.Router();
  const confidenceThreshold = config.NLP_CONFIDENCE_THRESHOLD || 0.75;

  router.post("/chat", async (req, res) => {
    try {
      console.log("📥 Received request to /api/chat");
      const { message } = req.body;
      console.log("Message:", message);

      if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message cannot be empty" });
      }

      console.log("🔍 Classifying message with NLP...");
      const nlpResult = await nlpManager.classify(message);
      console.log(
        "✓ NLP classification done:",
        nlpResult.intent,
        nlpResult.confidence
      );

      let response;
      let source;
      let confidence = nlpResult.confidence;
      let intent = nlpResult.intent;

      console.log(
        `📝 Query: "${message}" | Intent: ${intent} | Confidence: ${(
          confidence * 100
        ).toFixed(1)}%`
      );

      if (nlpResult.confidence >= confidenceThreshold && nlpResult.response) {
        response = nlpResult.response;
        source = "Local Bot";
        console.log("✓ Using Local Bot response");
      } else {
        console.log(
          `🔄 Triggering Gemini AI fallback (confidence: ${(
            confidence * 100
          ).toFixed(1)}%)`
        );
        const geminiResult = await geminiClient.getResponse(message, intent);
        console.log("✓ Got Gemini result:", geminiResult.source);

        if (geminiResult && geminiResult.answer) {
          response = geminiResult.answer;
          source = geminiResult.source;
          console.log(`✓ Gemini response received from ${source}`);
        } else {
          response =
            "I'm unable to generate a response right now. Please try asking about admissions, courses, or campus facilities.";
          source = "Error";
          confidence = 0;
        }
      }

      console.log("📤 Sending response...");
      res.json({ message, response, source, confidence, intent });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({
        error: "An error occurred while processing your message",
        details: error.message,
      });
    }
  });

  return router;
};
