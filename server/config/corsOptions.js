function sanitizeOrigin(origin) {
  if (!origin) return origin;
  return origin.replace(/\/+$/, "");
}

module.exports = function createCorsOptions(frontendUrl) {
  const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
  if (frontendUrl) {
    allowedOrigins.push(sanitizeOrigin(frontendUrl));
  } else {
    allowedOrigins.push("*");
  }

  return {
    origin: allowedOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  };
};
