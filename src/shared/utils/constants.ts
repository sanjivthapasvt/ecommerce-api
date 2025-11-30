export enum ServiceStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
}

export const JWT_EXPIRES_IN = '1d';
export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day in milliseconds

export const TWO_HOURS = 2 * 60 * 60 * 1000; // 2 hours
export const SEVEN_DAYS = 7 * 24 * 60 * 60; // 7 days in second
export const ACCESS_TOKEN_EXPIRES_IN = "7d";
export const THIRTY_DAYS = 30 * 24 * 60 * 60; // 30 days in second