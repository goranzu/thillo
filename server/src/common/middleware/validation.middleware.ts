import { validationResult } from "express-validator";
import appConfig from "../../config";
import { BadUserInputError } from "../errors";
import { MiddlewareFunction } from "../types";

class ValidationMiddleware {
  validateRequest: MiddlewareFunction = (req, res, next) => {
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

  validateRequestParam = (paramName: string): MiddlewareFunction => {
    return (req, res, next) => {
      if (req.body[paramName] == null) {
        throw new BadUserInputError(`Invalid ${paramName} param.`);
      }

      next();
    };
  };
}

export default new ValidationMiddleware();
