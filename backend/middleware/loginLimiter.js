const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5, // Maximum 5 failed attempts
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many failed login attempts. Please try again after 15 minutes.",
  },
});

module.exports = loginLimiter;