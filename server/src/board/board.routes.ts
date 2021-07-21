import express from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import validationMiddleware from "../common/middleware/validation.middleware";
import boardController from "./board.controller";
import commonMiddleware from "../common/middleware/common.middleware";
import { boardId, listId, memberId } from "../common/constants";

export class BoardRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "Board Routes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/boards")
      .get(boardController.list)
      .post(
        body("name").isString().escape(),
        body("description").isString().escape().optional(),
        validationMiddleware.validateRequest,
        boardController.createBoard,
      );

    this.app.param(boardId, commonMiddleware.extractParamToBody(boardId));

    this.app.param(listId, commonMiddleware.extractParamToBody(listId));

    this.app.param(memberId, commonMiddleware.extractParamToBody(memberId));

    this.app
      .route(`/api/boards/:${boardId}`)
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

    this.app
      .route(`/api/boards/:${boardId}/lists/:${listId}`)
      .all(
        validationMiddleware.validateRequestParam(boardId),
        validationMiddleware.validateRequestParam(listId),
      )
      .get(boardController.getListFromBoard);

    this.app
      .route(`/api/boards/:${boardId}/members`)
      .post(
        body("email").isEmail().normalizeEmail(),
        validationMiddleware.validateRequest,
        boardController.addMemberToBoard,
      );

    this.app
      .route(`/api/boards/:${boardId}/members/:${memberId}`)
      .all(
        validationMiddleware.validateRequestParam(boardId),
        validationMiddleware.validateRequestParam(memberId),
      )
      .delete(boardController.removeMemberFromBoard);

    return this.app;
  }
}
