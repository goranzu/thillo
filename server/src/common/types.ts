import { Request, Response, NextFunction } from "express";

export type Controller = (req: Request, res: Response) => Promise<any>;

declare module "express-session" {
  interface Session {
    user: Pick<User, "id" | "email">;
  }
}

declare module "express-serve-static-core" {
  interface Request {
    user: Pick<User, "id" | "email">;
  }
}

export type MiddlewareFunction = (
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

export interface FindList {
  listId: number;
  boardId: number;
  memberId: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  name?: string;
}

export interface UserWithoutPassword
  extends Omit<User, "password" | "firstName" | "lastName"> {
  name: string;
}
