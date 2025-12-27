import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  // Server
  PORT: z.string().default('3000'),
  NODE_ENVIRONMENT: z.enum(['development', 'production', 'staging', 'test']).default('development'),

  // Database
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  // Redis
  REDIS_URL: z.string().url('Invalid REDIS_URL'),

  // JWT
  JWT_SECRET_KEY: z.string().min(1, 'JWT_SECRET_KEY is required'),
  REFRESH_TOKEN_EXPIRES_DAYS: z.string().min(1, 'REFRESH_TOKEN_EXPIRES_DAYS'),

  // Cookies
  COOKIE_DOMAIN: z.string().min(1, 'COOKIE_DOMAIN'),

  // SMTP2GO
  SMTP2GO_USER: z.string().min(1, 'SMTP2GO_USER'),
  SMTP2GO_PASS: z.string().min(1, 'SMTP2GO_PASS'),
  SMTP2GO_FROM_EMAIL: z.string().min(1, 'SMTP2GO_FROM_EMAIL'),
});

// Validate and parse environment variables
export const validateEnvironmentVariables = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join('.')).join(', ');
      throw new Error(`Missing or invalid environment variables: ${missingVars}`);
    }
    throw error;
  }
};

// Validate
const env = validateEnvironmentVariables();

// Config object
export const config = {
  port: parseInt(env.PORT, 10),
  nodeEnv: env.NODE_ENVIRONMENT,

  jwt: {
    secret: env.JWT_SECRET_KEY,
    refreshExpiresDays: parseInt(env.REFRESH_TOKEN_EXPIRES_DAYS, 10),
  },

  database: {
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432', 10),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_DATABASE,
  },

  redis: {
    url: env.REDIS_URL,
  },

  cookie: {
    domain: env.COOKIE_DOMAIN,
  },

  smtp: {
    user: env.SMTP2GO_USER,
    pass: env.SMTP2GO_PASS,
    from: env.SMTP2GO_FROM_EMAIL,
  },
};
