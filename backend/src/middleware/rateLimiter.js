const rateLimit = require('express-rate-limit');

// Login limiter: 5 requests per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Forgot password limiter: 3 requests per 15 minutes per IP
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: { message: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Optional: General limiter (100 requests per 15 min per IP)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  forgotPasswordLimiter,
  generalLimiter,
};
