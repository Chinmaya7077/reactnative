// Wraps async route handlers so thrown errors flow into the central error middleware.
module.exports = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
