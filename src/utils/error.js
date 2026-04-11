class AppError extends Error {
  constructor(statusCode, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

function handleError(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details.length ? err.details : undefined
    });
  }

  if (err.name === 'SqliteError') {
    if (err.message.includes('UNIQUE constraint')) {
      return res.status(409).json({
        success: false,
        error: 'A record with this value already exists'
      });
    }
    if (err.message.includes('CHECK constraint')) {
      return res.status(400).json({
        success: false,
        error: 'Data validation failed: ' + err.message
      });
    }
  }

  console.error('Unexpected error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
}

module.exports = { AppError, handleError };