import { NextFunction, Request, Response } from "express";

type User = {
  id: number;
  email: string;
  name: string;
};

declare module "express-session" {
  interface Session {
    user: User;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user: User;
  }
}

export interface CustomRequest<T> extends Request {
  body: T;
}

export type Controller<T> = (
  req: CustomRequest<T>,
  res: Response,
) => Promise<void>;

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

export interface SignupInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
