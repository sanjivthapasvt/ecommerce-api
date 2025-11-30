import { Request, Response } from "express";
import * as cookie from "cookie";
import { SEVEN_DAYS, THIRTY_DAYS } from "./constants";

const getAccessTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.split(" ")[1];
};

const getResellerAccessTokenFromHeader = (req: Request): string | null => {
  const resellerHeader = req.headers["x-reseller-token"];
  if (!resellerHeader) return null;
  return Array.isArray(resellerHeader) ? resellerHeader[0] : resellerHeader;
};

const getAccessTokenFromCookie = (
  req: Request,
  cookieName: string,
): string | null => {
  return req.cookies?.[cookieName] ?? null;
};

export const getToken = (req: Request, cookieName: string): string | null => {
  return (
    getAccessTokenFromCookie(req, cookieName) || getAccessTokenFromHeader(req)
  );
};

export const getResellerToken = (
  req: Request,
  cookieName: string,
): string | null => {
  return (
    getAccessTokenFromCookie(req, cookieName) ||
    getResellerAccessTokenFromHeader(req)
  );
};

/**
 * Constructs cookie options based on environment configuration
 */
const getCookieOptions = (
  overrides: Partial<cookie.SerializeOptions> = {},
): cookie.SerializeOptions => {
  const options: cookie.SerializeOptions = {
    httpOnly: true,
    secure: true,
    sameSite: process.env.SAME_SITE_NONE ? "none" : "strict",
    path: "/",
    ...overrides,
  };

  // Explicitly set domain for prod/staging
  if (process.env.COOKIE_DOMAIN) {
    options.domain = process.env.COOKIE_DOMAIN;
  }

  return options;
};

export const setCookie = (
  res: Response,
  token: string,
  cookieName?: string,
) => {
  const name = cookieName || process.env.CUSTOMER_COOKIE_NAME!;
  const options = getCookieOptions({ maxAge: SEVEN_DAYS });

  res.setHeader("Set-Cookie", cookie.serialize(name, token, options));
};

export const removeCookie = (res: Response, cookieName?: string) => {
  const name = cookieName || process.env.CUSTOMER_COOKIE_NAME!;

  // For cookie removal, we need to match exact options that were used to set it
  // Expiring the cookie and clearing its value
  const options = getCookieOptions({
    expires: new Date(0),
    maxAge: 0, // Adding maxAge: 0 as an additional measure
  });

  res.clearCookie(name);
  // Primary method - set header directly
  res.setHeader("Set-Cookie", cookie.serialize(name, "", options));
};

export const setGuestCookie = (res: Response, guestId: string) => {
  const options = getCookieOptions({ maxAge: THIRTY_DAYS });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(process.env.GUEST_ID!, guestId, options),
  );
};

export const removeGuestCookie = (res: Response) => {
  const options = getCookieOptions({ expires: new Date(0) });

  res.setHeader(
    "Set-Cookie",
    cookie.serialize(process.env.GUEST_ID!, "", options),
  );
};
