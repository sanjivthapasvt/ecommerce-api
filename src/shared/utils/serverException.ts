import { StatusCodes } from "http-status-codes";
import { ServiceStatus } from "./constants";

export default class ServiceException extends Error {
  public statusCode: StatusCodes;
  public serviceStatus: ServiceStatus;
  public isOperational: boolean;

  constructor(
    statusCode: StatusCodes,
    serviceStatus: ServiceStatus,
    message: string,
    isOperational = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.serviceStatus = serviceStatus;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, ServiceException.prototype);
  }
}

export const isServiceException = (error: any): error is ServiceException =>
  "statusCode" in error;

export const getServiceException = (error: any) =>
  error.statusCode
    ? error
    : new ServiceException(StatusCodes.BAD_REQUEST, ServiceStatus.FAILURE, error.message);

export function ensureExists<T>(
  entity: T | null | undefined,
  message: string,
): asserts entity is T {
  if (!entity) {
    throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, message);
  }
  if (Array.isArray(entity) && entity.length === 0) {
    throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, message);
  }

  if (typeof entity === "object" && Object.keys(entity).length === 0) {
    throw new ServiceException(StatusCodes.NOT_FOUND, ServiceStatus.FAILURE, message);
  }
}
