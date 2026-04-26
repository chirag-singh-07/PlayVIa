const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // Handle Multer file size limit error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds 500MB limit',
    });
  }

  // Handle Multer invalid format error
  if (err.message === 'Only mp4, mov, and webm formats are allowed') {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  console.error('[SERVER ERROR]', err);
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
