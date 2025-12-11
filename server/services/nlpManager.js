const fs = require("fs");
const path = require("path");
const { NlpManager } = require("node-nlp");

class NLPManager {
  constructor() {
    this.manager = new NlpManager({
      languages: ["en"],
      autoSave: false,
      threshold: 0.75,
      trainByDomain: false,
    });
    this.trained = false;
  }

  /**
   * Load and train NLP model from Dialogflow JSON files
   */
  async trainModel() {
    try {
      const intentsDir = path.join(__dirname, "../data/intents");

      if (!fs.existsSync(intentsDir)) {
        console.error(`Intents directory not found: ${intentsDir}`);
        throw new Error(`Intents directory not found: ${intentsDir}`);
      }

      const files = fs.readdirSync(intentsDir);
      const responseFiles = files.filter(
        (f) => !f.includes("_usersays_en") && f.endsWith(".json")
      );
      const usersaysMap = new Map();

      // Build map of user says files for faster lookup
      files.forEach((f) => {
        if (f.includes("_usersays_en.json")) {
          const intentName = f.replace("_usersays_en.json", "");
          usersaysMap.set(intentName, f);
        }
      });

      let processedIntents = 0;
      const skippedIntents = [];

      // Process each intent
      for (const file of responseFiles) {
        const intentPath = path.join(intentsDir, file);
        const intentName = file.replace(".json", "");

        // Skip fallback and welcome intents - they should not be trained
        if (
          intentName.toLowerCase().includes("fallback") ||
          intentName.toLowerCase().includes("welcome")
        ) {
          skippedIntents.push(intentName);
          continue;
        }

        try {
          const intentData = JSON.parse(fs.readFileSync(intentPath, "utf-8"));

          // Extract response (optimized path)
          let response = "";
          const messages = intentData.responses?.[0]?.messages?.[0];
          if (messages?.speech?.[0]) {
            response = messages.speech[0];
          }

          // Get user says examples
          const usersaysFile = usersaysMap.get(intentName);
          if (usersaysFile) {
            const usersaysPath = path.join(intentsDir, usersaysFile);
            const usersaysData = JSON.parse(
              fs.readFileSync(usersaysPath, "utf-8")
            );

            // Add training data (optimized loop)
            if (Array.isArray(usersaysData) && usersaysData.length > 0) {
              usersaysData.forEach((item) => {
                const text = item.data?.[0]?.text;
                if (text) {
                  this.manager.addDocument("en", text, intentName);
                }
              });
              processedIntents++;
            }
          }

          // Store response for later retrieval
          if (!this.manager.responses) {
            this.manager.responses = {};
          }
          this.manager.responses[intentName] = response;
        } catch (error) {
          console.warn(`⚠️ Error processing ${file}:`, error.message);
        }
      }

      // Train the NLP manager with suppressed console output
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;

      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};

      await this.manager.train();

      // Restore console methods
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;

      this.trained = true;
      console.log(
        `✓ Chatbot ready with ${processedIntents} active intents (${skippedIntents.length} skipped)`
      );
    } catch (error) {
      console.error("Error training NLP model:", error);
      throw error;
    }
  }

  /**
   * Classify user input and get response
   */
  async classify(userInput) {
    if (!this.trained) {
      throw new Error("NLP model not trained. Call trainModel() first.");
    }

    try {
      const result = await this.manager.process("en", userInput);

      // Extract intent and confidence
      const intent = result.intent || "None";
      const confidence = result.score || 0;
      const response = this.manager.responses?.[intent] || null;

      // Use stricter threshold for fallback
      const confidenceThreshold =
        parseFloat(process.env.NLP_CONFIDENCE_THRESHOLD) || 0.75;
      const shouldUseFallback =
        confidence < confidenceThreshold || intent === "None" || !response;

      return {
        intent,
        confidence: confidence, // Keep as decimal for calculations
        response,
        shouldUseFallback,
        entities: result.entities || [],
      };
    } catch (error) {
      console.error("Error classifying input:", error);
      return {
        intent: "None",
        confidence: 0,
        response: null,
        shouldUseFallback: true,
        entities: [],
        error: error.message,
      };
    }
  }

  /**
   * Check if model is trained
   */
  isTrained() {
    return this.trained;
  }
}

module.exports = NLPManager;
