import jwt from "jsonwebtoken";
import { SERVICE_NAME } from "../utils/constants";
import type { StringValue } from "ms";

export type JsonTokenSignOptions = {
  ttl: StringValue | number;
  secretKey: string;
  issuer?: string;
};

export default class JwtHelper {
  static sign(payload: object, option: JsonTokenSignOptions): string {
    return jwt.sign({ ...payload, iss: SERVICE_NAME }, option.secretKey, {
      expiresIn: option.ttl,
    });
  }

  static verify<T>(token: string): T {
    try {
      if (!process.env.JWT_SECRET_KEY) {
        throw new Error("JWT_SECRET_KEY is not defined");
      }

      const decode = jwt.verify(token, process.env.JWT_SECRET_KEY as string, {
        complete: true,
      });

      if (decode.header?.alg === "none")
        throw new Error("Insecure token algorithm");
      if (typeof decode.payload === "string")
        throw new Error("Provided payload is invalid");
      if (decode.payload.iss !== SERVICE_NAME)
        throw new Error("Issuer is invalid");

      return decode.payload as unknown as T;
    } catch (error) {
      throw new Error("Token Verification Error");
    }
  }
}
