import { Request } from "express";

export type TEmailSendType = {
  to: string | string[];
  subject: string;
  text: string;
};

export interface AuthenticatedRequest<
  P = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user: {
    id: number;
    email: string;
  };
}