
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { generalLimiter } = require('./middleware/rateLimiter.js');
const errorHandler = require('./middleware/errorHandler.js');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;


// CORS middleware - allow cross-origin requests (must be before any routes)

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://devboard-4dco.onrender.com",
];

const envAllowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const corsOptions = {
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(
  cors(corsOptions)
);

// Register attachment routes after CORS and middleware are set up
const attachmentRoute = require('./routes/attachmentRoute.js');
app.use('/api', attachmentRoute);

// ============================================================================
// Middleware
// ============================================================================


// JSON parser with error handling
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Serve uploaded files statically
app.use("/api/uploads", express.static("uploads"));

// Apply general rate limiter globally
app.use(generalLimiter);

// ============================================================================
// Routes
// ============================================================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Auth Routes
const authRoute = require('./routes/authRoute.js');
app.use('/api/auth', authRoute);

// Board Routes
const boardRoute = require('./routes/boardRoute.js');
app.use('/api/boards', boardRoute);

// Column Routes
const columnRoute = require('./routes/columnRoute.js');
app.use('/api', columnRoute);

// Card Routes
const cardRoute = require('./routes/cardRoute.js');
app.use('/api', cardRoute);

// Comment Routes
const commentRoute = require('./routes/commentRoute.js');
app.use('/api', commentRoute);

// Member Routes
const memberRoute = require('./routes/memberRoute.js');
app.use('/api', memberRoute);

// Label Routes
const labelRoute = require('./routes/labelRoute.js');
app.use('/api', labelRoute);

// ============================================================================
// Error Handling
// ============================================================================

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// ============================================================================
// Server Startup
// ============================================================================

const server = app.listen(PORT, () => {
  console.log(`✓ Server is running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing server');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

