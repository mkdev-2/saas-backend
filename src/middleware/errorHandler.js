export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors
    });
  }

  res.status(500).json({
    message: 'Internal server error'
  });
};