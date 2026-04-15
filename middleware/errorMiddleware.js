export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const isDev = process.env.NODE_ENV !== 'production';
  
  console.error(`[ERROR] ${new Date().toISOString()} - Status: ${statusCode}`);
  console.error(`Message: ${err.message}`);
  if (isDev) console.error(`Stack: ${err.stack}`);
  
  res.status(statusCode).json({
    success: false,
    message: err.message,
    status: statusCode,
    ...(isDev && { stack: err.stack }),
  });
};
