import express from "express";
import { body } from "express-validator";
import * as boardController from "./board.controller";
import * as validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();
const boardId = "boardId";
const listId = "listId";

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
  .route(`/:${boardId}`)
  .get(validationMiddleware.checkIdParam(boardId), boardController.httpGetOne)
  .put(
    validationMiddleware.checkIdParam(boardId),
    body("name").isString().escape().optional(),
    body("description").isString().escape().optional(),
    body("isPrivate").isBoolean({ strict: true }).optional(),
    validationMiddleware.requestValidation,
    boardController.httpUpdateOne,
  )
  .delete(
    validationMiddleware.checkIdParam(boardId),
    boardController.httpDeleteOne,
  );

router
  .route(`/:${boardId}/lists/:${listId}`)
  .get(
    validationMiddleware.checkIdParam(boardId),
    validationMiddleware.checkIdParam(listId),
    boardController.httpGetList,
  );

export default router;
