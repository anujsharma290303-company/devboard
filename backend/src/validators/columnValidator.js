const { z } = require("zod");

const createColumnSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

const updateColumnSchema = z.object({
  title: z.string().trim().min(1).max(200),
});

const reorderColumnsSchema = z.object({
  columns: z
    .array(
      z.object({
        id: z.string().uuid(),
        position: z.number().int().min(0),
      }),
    )
    .min(1),
});

module.exports = {
  createColumnSchema,
  updateColumnSchema,
  reorderColumnsSchema,
};
