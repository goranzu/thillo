import e, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AnyZodObject } from "zod";
import { BadUserInputError } from "../errors";
import { MiddlewareFunction } from "../types";

function validateResource(schema: AnyZodObject) {
  return function (req: Request, res: Response, next: NextFunction): void {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res.status(400).json({ errors: error.errors });
      return;
    }
  };
}

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

export { validateRequest, validateRequestParam, validateResource };

// class ValidationMiddleware {
//   validateRequest: MiddlewareFunction = (req, res, next) => {
//     const errors = validationResult(req).formatWith(({ msg, param }) => {
//       return {
//         message: msg,
//         path: req.originalUrl,
//         param,
//       };
//     });

//     if (!errors.isEmpty()) {
//       res.status(400).json({ errors: errors.array() });
//       return;
//     }
//     next();
//   };

//   validateRequestParam = (paramName: string): MiddlewareFunction => {
//     return (req, res, next) => {
//       if (req.body[paramName] == null) {
//         throw new BadUserInputError(`Invalid ${paramName} param.`);
//       }

//       next();
//     };
//   };
// }

// export default new ValidationMiddleware();
