import { NextFunction, Request, Response } from "express";

import appConfig from "../config";

function errorHandler(
  err: Error & {
    statusCode: number;
    meta?: { target?: [string]; cause: string };
    param: string;
    constraint?: string;
  },
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.log(err);
  console.log(err.constraint);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong...";
  const param = err.param;

  if (err.constraint) {
    switch (err.constraint) {
      case "users_email_key":
        statusCode = 400;
        message = "This email is already registred.";
        break;
      case "boards_name_creatorId_key":
        statusCode = 400;
        message = "Board with this name already exists.";
        break;
    }
  }

  res.status(statusCode).json({
    errors: [
      {
        message,
        statusCode,
        param,
        path: req.originalUrl,
        stack: appConfig.ENV === "production" ? null : err.stack,
      },
    ],
  });
}

export default errorHandler;
