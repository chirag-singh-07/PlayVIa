const rateLimit = require('express-rate-limit');

/**
 * General Auth Rate Limiter
 * Limits sensitive auth requests to 5 per minute per IP
 */
const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = {
  authRateLimiter,
};
