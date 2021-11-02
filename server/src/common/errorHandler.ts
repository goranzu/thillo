import { NextFunction, Request, Response } from "express";

import appConfig from "../config";

function errorHandler(
  err: Error & {
    statusCode: number;
    meta?: { target?: [string]; cause: string };
    param: string;
  },
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong...";
  const param = err.param;

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
