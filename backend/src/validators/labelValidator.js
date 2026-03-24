const Joi = require("joi");

exports.createLabelSchema = {
  body: Joi.object({
    name: Joi.string().min(1).max(50).required(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required(),
  }),
};

exports.addLabelToCardSchema = {
  body: Joi.object({
    labelId: Joi.number().integer().required(),
  }),
};
