import { validationResult } from "express-validator";
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
}

export default new ValidationMiddleware();
