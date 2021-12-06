import express from "express";
import { query, param, body } from "express-validator";
import * as validationMiddleware from "../../common/middleware/validation.middleware";

import * as listController from "./list.controller";

// function extractQueryToBody(...rest: string[]): MiddlewareFunction {
//   return (req, res, next) => {
//     rest.forEach((name) => {
//       req.body[name] = req.query[name];
//     });
//     next();
//   };
// }

// function extractParamToBody(...rest: string[]): MiddlewareFunction {
//   return (req, res, next) => {
//     rest.forEach((name) => {
//       req.body[name] = req.params[name];
//     });
//     next();
//   };
// }

const router = express.Router();

router
  .route("/api/lists")
  .post(
    body("name").isString().escape(),
    body("description").isString().escape().optional(),
    query("boardId").isInt().toInt(),
    validationMiddleware.validateRequest,
    listController.createList,
  );

router
  .route("/api/lists/:listId")
  .all(
    query("boardId").isInt().toInt(),
    param("listId").isInt().toInt(),
    validationMiddleware.validateRequest,
  )
  .get(listController.getListById)
  .patch(
    body("name").isString().escape().optional(),
    body("description").isString().escape().optional(),
    validationMiddleware.validateRequest,
    listController.updateList,
  )
  .delete(listController.deleteList);

export default router;
