// Centralized error handler middleware
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const isDev = process.env.NODE_ENV === "development";

  const response = { message };
  if (isDev && err.stack) {
    response.stack = err.stack;
  }
  if (isDev && err.error) {
    response.error = err.error;
  }
  res.status(statusCode).json(response);
};
