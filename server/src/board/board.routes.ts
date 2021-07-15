import express from "express";
import { body } from "express-validator";
import commonMiddleware from "../common/common.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { BadUserInputError } from "../utils/errors";
import boardController from "./board.controller";

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
        commonMiddleware.validateRequest,
        boardController.createBoard,
      );

    this.app.param("boardId", (req, res, next) => {
      const { boardId } = req.params;
      try {
        const boardIdToNumber = Number(boardId);
        if (Number.isNaN(boardIdToNumber)) {
          throw new BadUserInputError("Ivalid id", "boardId");
        }

        req.body.boardId = boardIdToNumber;
        next();
      } catch (error) {
        throw new BadUserInputError("Ivalid id", "boardId");
      }
    });

    this.app.param("listId", (req, res, next) => {
      const { listId } = req.params;
      try {
        const listIdToNumber = Number(listId);
        if (Number.isNaN(listIdToNumber)) {
          throw new BadUserInputError("Ivalid id", "listId");
        }

        req.body.listId = listIdToNumber;
        next();
      } catch (error) {
        throw new BadUserInputError("Ivalid id", "listId");
      }
    });

    this.app.param("memberId", (req, res, next) => {
      const { memberId } = req.params;
      try {
        const memberIdToNumber = Number(memberId);
        if (Number.isNaN(memberIdToNumber)) {
          throw new BadUserInputError("Ivalid id", "memberId");
        }

        req.body.memberId = memberIdToNumber;
        next();
      } catch (error) {
        throw new BadUserInputError("Ivalid id", "memberId");
      }
    });

    this.app
      .route("/api/boards/:boardId")
      .get(boardController.getById)
      .put(
        body("name").isString().escape().optional(),
        body("description").isString().escape().optional(),
        body("isPrivate").isBoolean({ strict: true }).optional(),
        commonMiddleware.validateRequest,
        boardController.updateBoard,
      )
      .delete(boardController.deleteBoard);

    this.app
      .route(`/api/boards/:boardId/lists/:listId`)
      .get(boardController.getListFromBoard);

    this.app
      .route(`/api/boards/:boardId/members`)
      .post(
        body("email").isEmail().normalizeEmail(),
        commonMiddleware.validateRequest,
        boardController.addMemberToBoard,
      );

    this.app
      .route(`/api/boards/:boardId/members/:memberId`)
      .delete(boardController.removeMemberFromBoard);

    return this.app;
  }
}

// router
//   .route("/")
//   .get(boardController.httpGetAll)
//   .post(
//     body("name").isString().escape(),
//     body("description").isString().escape().optional(),
//     validationMiddleware.requestValidation,
//     boardController.httpCreateOne,
//   );

// router
//   .route(`/:${boardId}`)
//   .get(validationMiddleware.checkIdParam(boardId), boardController.httpGetOne)
//   .put(
//     validationMiddleware.checkIdParam(boardId),
//     body("name").isString().escape().optional(),
//     body("description").isString().escape().optional(),
//     body("isPrivate").isBoolean({ strict: true }).optional(),
//     validationMiddleware.requestValidation,
//     boardController.httpUpdateOne,
//   )
//   .delete(
//     validationMiddleware.checkIdParam(boardId),
//     boardController.httpDeleteOne,
//   );

// router
//   .route(`/:${boardId}/lists/:${listId}`)
//   .get(
//     validationMiddleware.checkIdParam(boardId),
//     validationMiddleware.checkIdParam(listId),
//     boardController.httpGetList,
//   );

// router
//   .route(`/:${boardId}/members`)
//   .post(
//     body("email").isEmail().normalizeEmail(),
//     validationMiddleware.requestValidation,
//     validationMiddleware.checkIdParam(boardId),
//     boardController.httpAddMember,
//   );

// router
//   .route(`/:${boardId}/members/:${memberId}`)
//   .delete(
//     validationMiddleware.checkIdParam(boardId),
//     validationMiddleware.checkIdParam(memberId),
//     boardController.httpRemoveMember,
//   );

// export default router;
