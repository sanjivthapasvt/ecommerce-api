import { ServiceStatus } from './constants';

export class ServerResponse<T> {
  public status: ServiceStatus;
  public message: string;
  public data: T | null;

  constructor(status: ServiceStatus, message: string, data: T | null = null) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  public static success<T>(data: T, message = 'Operation successful'): ServerResponse<T> {
    return new ServerResponse(ServiceStatus.SUCCESS, message, data);
  }

  public static failure<T>(message: string, data: T | null = null): ServerResponse<T> {
    return new ServerResponse(ServiceStatus.FAILURE, message, data);
  }

  public toJson() {
    return {
      status: this.status,
      message: this.message,
      data: this.data,
    };
  }
}
