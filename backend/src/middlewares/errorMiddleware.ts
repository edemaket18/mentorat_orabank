import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  statusCode?: number;
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error: ErrorWithStatus = new Error(`Non trouvé - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
