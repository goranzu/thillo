import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadUserInputError } from "../utils/errors";

function requestValidation(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const errors = validationResult(req).formatWith(({ msg, param }) => {
    return {
      message: msg,
      path: req.originalUrl,
      param,
    };
  });
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
}

function checkIdParam(paramName: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const param = req.params[paramName];
    const paramToNumber = Number(param);

    if (Number.isNaN(paramToNumber)) {
      throw new BadUserInputError(`Bad ${paramName}`, paramName);
    }

    next();
  };
}

export { requestValidation, checkIdParam };
