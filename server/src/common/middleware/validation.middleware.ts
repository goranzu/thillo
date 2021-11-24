import { validationResult } from "express-validator";
import { BadUserInputError } from "../errors";
import { MiddlewareFunction } from "../types";

const validateRequest: MiddlewareFunction = (req, res, next) => {
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
};

const validateRequestParam = (paramName: string): MiddlewareFunction => {
  return (req, res, next) => {
    if (req.body[paramName] == null) {
      throw new BadUserInputError(`Invalid ${paramName} param.`);
    }

    next();
  };
};

export { validateRequest, validateRequestParam };
