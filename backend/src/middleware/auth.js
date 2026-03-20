// ============================================================================
// Dependencies
// ============================================================================

const jwt = require("jsonwebtoken");

// ============================================================================
// Authentication Middleware
// ============================================================================

/**
 * Middleware to verify JWT access token from Authorization header
 * Extracts and validates Bearer token, attaches user info to req object
 *
 * Usage: app.use('/protected', authenticate, controllerHandler);
 */
const authenticate = (req, res, next) => {
  // Extract Authorization header
  const authorization = req.headers.authorization;

  // Validate header format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  // Extract token from "Bearer <token>"
  const token = authorization.split(" ")[1];

  try {
    // Verify token signature and expiry
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request object (payload contains { userId })
    req.user = { id: payload.userId };
    req.token = token;

    return next();
  } catch (error) {
    // Handle different JWT errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token expired" });
    }

    return res.status(401).json({ message: "Invalid access token" });
  }
};

module.exports = authenticate;