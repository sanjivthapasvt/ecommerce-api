import { EntityNotFoundError, QueryFailedError } from "typeorm";
import slugify from "slugify";
import passwordGenerator from "generate-password";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { StatusCodes } from 'http-status-codes';

export const getDatabaseExceptionStatusCode = (error: any): StatusCodes => {
  // Basic error code mapping, can be expanded
  if (error.code === '23505') { // Unique violation
    return StatusCodes.CONFLICT;
  }
  return StatusCodes.INTERNAL_SERVER_ERROR;
};

export const generateRandom9DigitNumber = (): string => {
  return Math.floor(100000000 + Math.random() * 900000000).toString();
};

export function getDatabaseExceptionStatusCodeOld(err: unknown): number {
  let statusCode = 500;

  if (err instanceof QueryFailedError) {
    const dbErrorCode = (err as any).code;

    switch (dbErrorCode) {
      case "23505": // Unique constraint violation
        statusCode = 409;
        break;
      case "23503": // Foreign key violation
        statusCode = 400;
        break;
      case "23502": // Not null violation
        statusCode = 400;
        break;
      case "22001": // String too long
        statusCode = 400;
        break;
      case "42P01": // Table not found
        statusCode = 500;
        break;
      case "42703": // Column not found
        statusCode = 400;
        break;
      case "42601": // SQL syntax error
        statusCode = 400;
        break;
      default:
        statusCode = 500;
    }
    return statusCode;
  }

  // Handle "Entity Not Found" errors
  if (err instanceof EntityNotFoundError) {
    return 404;
  }

  // Fallback for unexpected errors
  return statusCode;
}

export const slugGenerator = (title: string) => {
  return (
    slugify(title, {
      replacement: "-",
      remove: undefined,
      lower: true,
      strict: true,
    }) +
    "-" +
    new Date().getTime()
  );
};

export const randomPasswordGenerator = () => {
  return passwordGenerator.generate({
    length: 10,
    numbers: true,
  });
};

export const randomTokenGenerator = () => {
  return crypto.randomBytes(32).toString("hex");
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function extractFirstDomainPart(raw: string): string {
  try {
    const url = new URL(raw.startsWith("http") ? raw : `http://${raw}`);
    const hostname = url.hostname.replace(/^www\./, "").toLowerCase(); // remove 'www.'
    return hostname.split(".").slice(-2).join("."); // get the last two segments
  } catch {
    // fallback if raw is not a valid URL
    const cleaned = raw
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .split("/")[0]
      .toLowerCase();
    return cleaned.split(".")[0]; // get the first segment
  }
}

export function validateTimestamp(timestamp: number) {
  if (isNaN(timestamp)) {
    return false;
  }
  return true;
}

export function validateURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const generateIdentifier = (name: string) => {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
};

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function addMarkupRateToPrice(
  price: number,
  markupRate: number,
): number {
  const markup = (price * markupRate) / 100;
  return price + markup;
}
