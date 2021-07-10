import express from "express";
import { body } from "express-validator";
import * as boardController from "./board.controller";
import * as validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();
const param = "boardId";

router
  .route("/")
  .get(boardController.httpGetAll)
  .post(
    body("name").isString().escape(),
    body("description").isString().escape().optional(),
    validationMiddleware.requestValidation,
    boardController.httpCreateOne,
  );

router
  .route(`/:${param}`)
  .get(validationMiddleware.checkIdParam(param), boardController.httpGetOne)
  .put(
    validationMiddleware.checkIdParam(param),
    body("name").isString().escape().optional(),
    body("description").isString().escape().optional(),
    body("isPrivate").isBoolean({ strict: true }).optional(),
    validationMiddleware.requestValidation,
    boardController.httpUpdateOne,
  )
  .delete(
    validationMiddleware.checkIdParam(param),
    boardController.httpDeleteOne,
  );

export default router;
