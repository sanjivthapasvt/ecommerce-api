import { ServiceStatus } from '@/shared/utils/constants';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function validateDto(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoObject);

    if (errors.length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: ServiceStatus.FAILURE,
        message: 'Validation failed',
      });
    }

    req.body = dtoObject;
    return next();
  };
}
