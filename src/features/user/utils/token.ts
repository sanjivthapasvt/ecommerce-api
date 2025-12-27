import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '@/config/environmentVariables';

const SECRET_KEY = config.jwt.secret;
const REFRESH_EXPIRES_DAYS = config.jwt.refreshExpiresDays;

export const generateToken = ({ id, email }: { email: string; id: string }) => {
  return jwt.sign({ id, email }, SECRET_KEY, { expiresIn: '30m' });
};

export function verifyAccessToken(token: string) {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (e) {
    return null;
  }
}

// Create opaque refresh token string (not a JWT)
export function createRefreshTokenString() {
  return randomUUID() + '-' + randomUUID();
}

export function getRefreshTokenExpiryDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_EXPIRES_DAYS);
  return d;
}

// Hash and compare refresh tokens before storing/verifying
export async function hashToken(token: string) {
  const saltRounds = 10;
  return bcrypt.hash(token, saltRounds);
}

export async function verifyTokenHash(token: string, hash: string) {
  return bcrypt.compare(token, hash);
}
