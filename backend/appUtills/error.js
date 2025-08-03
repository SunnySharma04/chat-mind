const ErrorHandler = require("../appUtills/error");

const errorMiddleware = (err, req, res, next) => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Log full error in console (for debug)
  console.error("Error occurred:", err);

  res.status(err.statusCode).json({
    success: false,
    message: err.message,           // ✅ send actual error message
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
