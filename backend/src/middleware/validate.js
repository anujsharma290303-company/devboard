exports.validate = (schema) => {
  return (req, res, next) => {
    try {
      if (schema.body) {
        const { error, value } = schema.body.validate(req.body);

        if (error) {
          return res.status(400).json({
            message: "Validation error",
            errors: error.details.map((d) => d.message),
          });
        }

        req.body = value;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};