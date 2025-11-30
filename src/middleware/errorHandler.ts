import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../shared/utils/logger';
import ServiceException from '../shared/utils/serverException';
import { ServiceStatus } from '../shared/utils/constants';


export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof ServiceException) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.serviceStatus,
        message: err.message,
      });
    }
    // Log non-operational service exceptions
    logger.error('Non-operational ServiceException:', err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: ServiceStatus.FAILURE,
      message: 'Internal server error',
    });
  }

  // Log other unexpected errors
  logger.error('Unexpected Error:', err);

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: ServiceStatus.FAILURE,
    message: 'An unexpected internal server error occurred.',
  });
}; 