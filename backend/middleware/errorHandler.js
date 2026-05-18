// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error(err.stack);

  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({ error: 'Resource not found - invalid ID format' });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value entered' });
  }

  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
