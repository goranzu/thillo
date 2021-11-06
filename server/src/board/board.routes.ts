import express from "express";
import { body } from "express-validator";
import * as validationMiddleware from "../common/middleware/validation.middleware";
import * as boardController from "./board.controller";
import * as commonMiddleware from "../common/middleware/common.middleware";
import { boardId, listId, memberId } from "../common/constants";

const router = express.Router();

router
  .route("/boards")
  .get(boardController.list)
  .post(
    body("name").isString().escape(),
    body("description").isString().escape().optional(),
    validationMiddleware.validateRequest,
    boardController.createBoard,
  );

router.param(boardId, commonMiddleware.extractParamToBody(boardId));

router.param(listId, commonMiddleware.extractParamToBody(listId));

router.param(memberId, commonMiddleware.extractParamToBody(memberId));

router
  .route(`/boards/:${boardId}`)
  .all(validationMiddleware.validateRequestParam(boardId))
  .get(boardController.getById)
  .put(
    body("name").isString().escape().optional(),
    body("description").isString().escape().optional(),
    body("isPrivate").isBoolean({ strict: true }).optional(),
    validationMiddleware.validateRequest,
    boardController.updateBoard,
  )
  .delete(boardController.deleteBoard);

router
  .route(`/boards/:${boardId}/members`)
  .post(
    body("email").isEmail().normalizeEmail(),
    validationMiddleware.validateRequest,
    boardController.addMemberToBoard,
  );

router
  .route(`/boards/:${boardId}/members/:${memberId}`)
  .all(
    validationMiddleware.validateRequestParam(boardId),
    validationMiddleware.validateRequestParam(memberId),
  )
  .delete(boardController.removeMemberFromBoard);

export default router;
