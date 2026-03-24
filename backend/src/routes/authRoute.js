// ============================================================================
// Dependencies
// ============================================================================

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const authenticate = require("../middleware/auth.js");
const { validate } = require("../middleware/validate.js");
const { registerSchema, loginSchema, refreshTokenSchema, logoutSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validators/authValidator.js");
/**
 * POST /api/auth/forgot-password
 * Public endpoint to request a password reset link
 * Body: { email }
 */
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * POST /api/auth/reset-password
 * Public endpoint to reset password using token
 * Body: { token, newPassword } 
 */
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// ============================================================================
// Auth Routes
// ============================================================================

/**
 * POST /api/auth/register
 * Public endpoint to create a new user account
 * Body: { displayName, email, password }
 */
router.post("/register", validate(registerSchema), authController.register);

/**
 * POST /api/auth/login
 * Public endpoint to authenticate user and receive tokens
 * Body: { email, password }
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * POST /api/auth/refresh-token
 * Public endpoint to rotate refresh tokens
 * Body: { refreshToken }
 */
router.post("/refresh-token", validate(refreshTokenSchema), authController.refreshToken);

/**
 * POST /api/auth/logout
 * Protected endpoint to revoke refresh tokens
 * Headers: Authorization: Bearer <accessToken>
 * Body: { refreshToken }
 */
router.post("/logout", authenticate, validate(logoutSchema), authController.logout);

module.exports = router;