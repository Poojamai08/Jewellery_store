
const rateLimit = require("express-rate-limit");

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  skipSuccessfulRequests: true,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Too many failed admin login attempts. Please try again later.",
  },
});

module.exports = adminLoginLimiter;
