const { ZodError } = require("zod");

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req[source]);
      req[source] = parsed;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        return res.status(422).json({
          statusCode: 422,
          message: "Validatsiya xatosi",
          errors,
        });
      }
      next(error);
    }
  };
};

module.exports = validate;
