const { z } = require("zod");

const addCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  parentId: z.string().uuid().optional().nullable(),
});

const updateCommentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

module.exports = {
  addCommentSchema,
  updateCommentSchema,
};
