const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const createCorsOptions = require("./config/corsOptions");
const registerRoutes = require("./routes");

function createApp({ nlpManager, geminiClient, config }) {
  const app = express();

  const corsOptions = createCorsOptions(config.FRONTEND_URL);
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  registerRoutes(app, { nlpManager, geminiClient, config });

  return app;
}

module.exports = createApp;
