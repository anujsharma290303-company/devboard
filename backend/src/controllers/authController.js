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
const sendAuthResponse = ({ res, statusCode, accessToken, refreshToken, user }) => {
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

  // Validate required fields
  if (!displayName || !email || !password) {
    return res.status(400).json({
      message: "displayName, email and password are required",
    });
  }

  try {
    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
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
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /login
 * Authenticate user with email/password and issue tokens
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required",
    });
  }

  try {
    // Find user by email
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
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
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /logout
 * Revoke all refresh tokens for the authenticated user
 */
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    // Delete the refresh token from database
    await prismaClient.refreshToken.deleteMany({
      where: { token: hashToken(refreshToken) },
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /refresh-token
 * Rotate refresh token and issue new access + refresh tokens
 */
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    // Find stored refresh token
    const storedToken = await prismaClient.refreshToken.findUnique({
      where: { token: hashToken(refreshToken) },
    });

    if (!storedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if token is revoked or expired
    if (storedToken.revoked || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
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
    res.status(500).json({ message: "Server error" });
  }
};
