const { z } = require("zod");

const cardPriorityEnum = z.enum(["low", "medium", "high"]);

const createCardSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().max(5000).optional().nullable(),
  priority: z
    .preprocess(
      (value) => (typeof value === "string" ? value.toLowerCase() : value),
      cardPriorityEnum,
    )
    .optional(),
  dueDate: z.string().datetime().optional().nullable(),
  assigneeId: z.string().uuid().optional().nullable(),
});

const updateCardSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().trim().max(5000).optional().nullable(),
    priority: z
      .preprocess(
        (value) => (typeof value === "string" ? value.toLowerCase() : value),
        cardPriorityEnum,
      )
      .optional(),
    dueDate: z.string().datetime().optional().nullable(),
    assigneeId: z.string().uuid().optional().nullable(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.description !== undefined ||
      data.priority !== undefined ||
      data.dueDate !== undefined ||
      data.assigneeId !== undefined,
    { message: "At least one field is required" },
  );

const moveCardSchema = z.object({
  targetColumnId: z.string().uuid(),
  position: z.number().int().min(0),
});

module.exports = {
  createCardSchema,
  updateCardSchema,
  moveCardSchema,
};
