// ============================================================================
// Dependencies
// ============================================================================

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const authenticate = require("../middleware/auth.js");

// ============================================================================
// Auth Routes
// ============================================================================

/**
 * POST /api/auth/register
 * Public endpoint to create a new user account
 * Body: { displayName, email, password }
 */
router.post("/register", authController.register);

/**
 * POST /api/auth/login
 * Public endpoint to authenticate user and receive tokens
 * Body: { email, password }
 */
router.post("/login", authController.login);

/**
 * POST /api/auth/refresh-token
 * Public endpoint to rotate refresh tokens
 * Body: { refreshToken }
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * POST /api/auth/logout
 * Protected endpoint to revoke refresh tokens
 * Headers: Authorization: Bearer <accessToken>
 * Body: { refreshToken }
 */
router.post("/logout", authenticate, authController.logout);

module.exports = router;