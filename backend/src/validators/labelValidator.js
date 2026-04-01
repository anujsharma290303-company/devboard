const { z } = require("zod");

exports.createLabelSchema = {
  body: z.object({
    name: z.string().min(1).max(50),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
};

exports.addLabelToCardSchema = {
  body: z.object({
    labelId: z.number().int(),
  }),
};
