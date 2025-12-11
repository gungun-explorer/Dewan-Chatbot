const infoRoutes = require("./infoRoutes");
const chatRoutes = require("./chatRoutes");

module.exports = function registerRoutes(app, deps) {
  app.use("/", infoRoutes(deps));
  app.use("/api", chatRoutes(deps));
};
