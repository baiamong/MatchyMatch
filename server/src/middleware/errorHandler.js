/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, _next) => {
  console.error('Error:', err);

  // Default error status and message
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Don't leak error details in production
  const response = {
    error: message,
  };

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

/**
 * 404 handler
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({ error: 'Not Found' });
};

export default errorHandler;
