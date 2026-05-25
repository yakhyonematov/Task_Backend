const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Mongoose (email takror bo'lganda)
  if (err.code === 11000) {
    const field = err.keyPattern ? Object.keys(err.keyPattern)[0] : "field";
    return res.status(409).json({
      statusCode: 409,
      message:
        field === "email"
          ? "Bu email allaqachon ro'yxatdan o'tgan"
          : `Bu ${field} allaqachon mavjud`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(422).json({
      statusCode: 422,
      message: "Validatsiya xatosi",
      errors,
    });
  }

  // Mongoose CastError (noto'g'ri ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      statusCode: 400,
      message: "Noto'g'ri ID formati",
    });
  }

  // Custom HTTP error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  // Default 500
  return res.status(500).json({
    statusCode: 500,
    message: "Server xatosi yuz berdi",
  });
};

module.exports = errorHandler;
