const bcrypt = require("bcryptjs");
const prismaClient = require("../config/prisma");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const REFRESH_TOKEN_EXPIRY_DAYS = Number(
  process.env.REFRESH_TOKEN_EXPIRY_DAYS || 7,
);

// Persist only a hash of refresh tokens so leaked DB data cannot be reused directly.
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const createAccessToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });

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

const sendAuthResponse = ({ res, statusCode, accessToken, refreshToken, user }) => {
  res.status(statusCode).json({
    token: accessToken,
    accessToken,
    refreshToken,
    ...(user && { user }),
  });
};

exports.register = async (req, res) => {
  const { displayName, email, password } = req.body;

  if (!displayName || !email || !password) {
    return res
      .status(400)
      .json({ message: "displayName, email and password are required" });
  }

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: { displayName, email, passwordHash: hashedPassword },
    });

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

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await prismaClient.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    await prismaClient.refreshToken.deleteMany({
      where: { token: hashToken(refreshToken) },
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "refreshToken is required" });
  }

  try {
    const storedToken = await prismaClient.refreshToken.findUnique({
      where: { token: hashToken(refreshToken) },
    });

    if (!storedToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    if (storedToken.revoked || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Refresh token expired" });
    }

    const userId = storedToken.userId;
    const newAccessToken = createAccessToken(userId);

    // Rotate refresh token: invalidate old one before issuing a new one.
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
