import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
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
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong...";
  let param = err.param;
  console.log(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      param = err.meta?.target ? err.meta?.target[0] : "value";
      message = `This ${param} already exists.`;
      //   if (err.meta?.target?.includes("email")) {
      //     message = "This email is already registered.";
      //     param = "email";
      //   }
    }

    if (err.code === "P2025") {
      statusCode = 404;
      param = err.meta?.target ? err.meta?.target[0] : "value";
      message = err.meta?.cause || "";
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
