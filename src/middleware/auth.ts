import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environmentVariables';
import { StatusCodes } from 'http-status-codes';
import { ServiceStatus } from '../shared/utils/constants';
import ServiceException from '../shared/utils/serverException';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new ServiceException(
        StatusCodes.UNAUTHORIZED,
        ServiceStatus.FAILURE,
        'No token provided',
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new ServiceException(
        StatusCodes.UNAUTHORIZED,
        ServiceStatus.FAILURE,
        'No token provided',
      );
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: number;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      next(
        new ServiceException(
          StatusCodes.UNAUTHORIZED,
          ServiceStatus.FAILURE,
          'Invalid token',
        ),
      );
    } else if (error.name === 'TokenExpiredError') {
      next(
        new ServiceException(
          StatusCodes.UNAUTHORIZED,
          ServiceStatus.FAILURE,
          'Token expired',
        ),
      );
    } else {
      next(error);
    }
  }
}; 