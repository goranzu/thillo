import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import debug from "debug";

type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;

const logger = debug("app: common-middleware");

class CommonMiddleware {
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

export default new CommonMiddleware();
