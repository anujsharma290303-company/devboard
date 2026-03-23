const {z} = require('zod');

// Middleware to validate request body against a Zod schema
const createBoardSchema = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    emoji: z.string().max(10).optional(),
});

const updateBoardSchema = z
    .object({
        name: z.string().min(1).max(100).optional(),
        description: z.string().max(500).optional(),
        emoji: z.string().max(10).optional(),
    })
    .refine(
        (data) => data.name || data.description !== undefined || data.emoji,
        { message: "At least one field is required" },
    );

module.exports = {
    createBoardSchema,
    updateBoardSchema,  
};