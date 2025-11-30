import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

// Zod schema to validate required environment variables
const envSchema = z.object({
  //Server environment variables
  PORT: z.string().default('3000'),
  NODE_ENVIRONMENT: z.enum(['development', 'production', 'staging', 'test']).default('development'),

  //Database environment variables
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_USERNAME: z.string(),
  DB_PASSWORD: z.string(),
  DB_DATABASE: z.string(),

  //JWT environment variables
  JWT_SECRET: z.string(),

  //Smtp
  SMTP2GO_USER: z.string().min(1, "SMTP_USER"),
  SMTP2GO_PASS: z.string().min(1, "SMTP_PASS"),
  SMTP2GO_FROM_EMAIL: z.string().min(1, "SMTP_FROM_EMAIL"),
});

// Validate the environment variables
export const validateEnvironmentVariables = () => {
  try {
    envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((err) => err.path.join('.')).join(', ');
      throw new Error(`Missing required environment variables: ${missingVars}`);
    }
    throw error;
  }
};

export const config = {

  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  database: {
    host: process.env.DB_HOST ,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
} as const;
