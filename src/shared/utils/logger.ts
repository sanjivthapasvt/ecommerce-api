import winston from "winston";
// import { format } from "logfor÷m";
import "winston-daily-rotate-file"; // Log rotation package

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Set up log rotation transport
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: "logs/%DATE%-app.log", // Log files will be saved as daily rotated files
  datePattern: "YYYY-MM-DD", // Date format for log file
  zippedArchive: true, // Archive old logs into a compressed format
  maxSize: "20m", // Max size per log file (before rotation happens)
  maxFiles: "14d", // Keep logs for the last 14 days
});

const logger = winston.createLogger({
  level: "info", // Default log level for production
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    dailyRotateTransport, // Use daily rotate file transport
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '14d',
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});

// If we're not in production, log to the console with colors
if (process.env.NODE_ENVIRONMENT !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  );
}

export { logger };
