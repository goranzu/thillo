import { Request, Response, NextFunction } from "express";

export type Controller = (req: Request, res: Response) => Promise<any>;

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
