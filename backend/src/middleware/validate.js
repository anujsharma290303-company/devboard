const { z } = require("zod");

// Middleware to validate request body against a Zod schema

exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      // Validate req.body against the provided schema
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        // If validation fails, return 400 with error details
        return res.status(400).json({
          message: "Validation error",
          errors: err.errors,
        });
      }
      // For other types of errors, pass to the global error handler
      next(err);
    }
  };
};
