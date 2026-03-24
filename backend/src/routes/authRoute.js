// ============================================================================
// Dependencies
// ============================================================================

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const authenticate = require("../middleware/auth.js");
const avatarUpload = require("../middleware/avatarUpload.js");
const { validate } = require("../middleware/validate.js");
const { loginLimiter, forgotPasswordLimiter } = require("../middleware/rateLimiter.js");
const { registerSchema, loginSchema, refreshTokenSchema, logoutSchema, forgotPasswordSchema, resetPasswordSchema } = require("../validators/authValidator.js");
/**
 * POST /api/auth/forgot-password
 * Public endpoint to request a password reset link
 * Body: { email }
 */
router.post("/forgot-password", forgotPasswordLimiter, validate(forgotPasswordSchema), authController.forgotPassword);

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
router.post("/login", loginLimiter, validate(loginSchema), authController.login);

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

// PUT /auth/avatar - upload or replace user avatar
router.put("/avatar", authenticate, avatarUpload, authController.uploadAvatar);

module.exports = router;