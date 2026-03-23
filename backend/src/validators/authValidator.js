const {z} = require('zod');

// Middleware to validate request body against a Zod schema
const registerSchema = z.object({
    displayName: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100),
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1),
});

const logoutSchema = z.object({
  refreshToken: z.string().min(1)
});

module.exports = {
    registerSchema,
    loginSchema,
    refreshTokenSchema,
    logoutSchema,
};

