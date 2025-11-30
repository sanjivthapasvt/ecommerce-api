import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ServiceStatus } from '../shared/utils/constants';
import ServiceException from '../shared/utils/serverException';
import { Role } from '../features/user/types';

export const authorize = (allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ServiceException(
          StatusCodes.UNAUTHORIZED,
          ServiceStatus.FAILURE,
          'User not authenticated',
        );
      }

      if (!allowedRoles.includes(req.user.role as Role)) {
        throw new ServiceException(
          StatusCodes.FORBIDDEN,
          ServiceStatus.FAILURE,
          'Insufficient permissions',
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 