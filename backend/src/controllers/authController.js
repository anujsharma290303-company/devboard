// ============================================================================
// Dependencies
// ============================================================================

const bcrypt = require("bcryptjs");
const prismaClient = require("../config/prisma");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// ============================================================================
// Configuration & Constants
// ============================================================================

const REFRESH_TOKEN_EXPIRY_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRY_DAYS || 7,
);

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Hash a token using SHA-256
 * Purpose: Persist only hashes in DB so leaked data cannot be reused directly
 */
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

/**
 * Create a JWT access token signed with JWT_SECRET
 */
const createAccessToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

/**
 * Generate and persist a refresh token in the database
 * Returns the unhashed token for client use; DB stores hashed version
 */
const issueRefreshToken = async (userId) => {
  const refreshToken = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(
    Date.now() + REFRESH_TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  );

  await prismaClient.refreshToken.create({
    data: {
      userId,
      token: hashToken(refreshToken),
      expiresAt,
    },
  });

  return refreshToken;
};

/**
 * Send a standardized auth response with tokens and optional user data
 */
const sendAuthResponse = ({
  res,
  statusCode,
  accessToken,
  refreshToken,
  user,
}) => {
  res.status(statusCode).json({
    token: accessToken,
    accessToken,
    refreshToken,
    ...(user && { user }),
  });
};

// ============================================================================
// Auth Controllers
// ============================================================================

/**
 * POST /register
 * Create a new user with hashed password and issue tokens
 */
exports.register = async (req, res) => {
  const { displayName, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      const error = new Error("Email already in use");
      error.statusCode = 400;
      throw error;
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: { displayName, email, passwordHash: hashedPassword },
    });

    // Issue tokens
    const refreshToken = await issueRefreshToken(user.id);
    const accessToken = createAccessToken(user.id);

    sendAuthResponse({
      res,
      statusCode: 201,
      accessToken,
      refreshToken,
      user: { id: user.id, displayName: user.displayName, email: user.email },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

/**
 * POST /login
 * Authenticate user with email/password and issue tokens
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // Issue tokens
    const refreshToken = await issueRefreshToken(user.id);
    const accessToken = createAccessToken(user.id);

    sendAuthResponse({
      res,
      statusCode: 200,
      accessToken,
      refreshToken,
      user: { id: user.id, displayName: user.displayName, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

/**
 * POST /logout
 * Revoke all refresh tokens for the authenticated user
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Delete the refresh token from database
    await prismaClient.refreshToken.deleteMany({
      where: { token: hashToken(refreshToken) },
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    next(error);
  }
};

/**
 * POST /refresh-token
 * Rotate refresh token and issue new access + refresh tokens
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    // Find stored refresh token
    const storedToken = await prismaClient.refreshToken.findUnique({
      where: { token: hashToken(refreshToken) },
    });

    if (!storedToken) {
      const error = new Error("Invalid refresh token");
      error.statusCode = 401;
      throw error;
    }

    // Check if token is revoked or expired
    if (storedToken.revoked || storedToken.expiresAt < new Date()) {
      const error = new Error("Refresh token expired");
      error.statusCode = 401;
      throw error;
    }

    const userId = storedToken.userId;
    const newAccessToken = createAccessToken(userId);

    // Token rotation: invalidate old token before issuing new one
    await prismaClient.refreshToken.delete({ where: { id: storedToken.id } });
    const newRefreshToken = await issueRefreshToken(userId);

    sendAuthResponse({
      res,
      statusCode: 200,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    next(error);
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prismaClient.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(200).json({
        message: "If email exists, reset link sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = hashToken(resetToken);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prismaClient.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prismaClient.passwordResetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(`RESET LINK: ${resetUrl}`);

    res.status(200).json({ message: "Reset link sent" });

  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const hashedToken = hashToken(token);

    const record = await prismaClient.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!record || record.expiresAt < new Date()) {
      const error = new Error("Invalid or expired token");
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prismaClient.user.update({
      where: { id: record.user.id },
      data: { passwordHash: hashedPassword },
    });

    // delete token
    await prismaClient.passwordResetToken.delete({
      where: { id: record.id },
    });

    // 🔥 logout from all devices
    await prismaClient.refreshToken.deleteMany({
      where: { userId: record.user.id },
    });

    res.status(200).json({
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};

/**
 * Upload user avatar, update avatarPath in DB, return updated user
 * PUT /api/auth/avatar
 */
exports.uploadAvatar = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      const error = new Error("Unauthorized");
      error.statusCode = 401;
      throw error;
    }
    if (!req.file) {
      const error = new Error("No file uploaded");
      error.statusCode = 400;
      throw error;
    }
    // Update user avatarPath in DB
    const updatedUser = await prismaClient.user.update({
      where: { id: userId },
      data: { avatarPath: req.file.path },
    });
    res.status(200).json({
      user: updatedUser,
      avatarUrl: `/api/uploads/avatars/${userId}/avatar.jpg`,
    });
  } catch (err) {
    next(err);
  }
};