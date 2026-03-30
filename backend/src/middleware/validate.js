exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      // Support both: validate(zodSchema) and validate({ body: zodSchema })
      const bodySchema = schema.body || schema;
      
      if (bodySchema && typeof bodySchema.safeParse === 'function') {
        const result = bodySchema.safeParse(req.body);
        if (!result.success) {
          return res.status(400).json({
            message: "Validation error",
            errors: result.error.errors.map((e) => e.message),
          });
        }
        req.body = result.data;
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};