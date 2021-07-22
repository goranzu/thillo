import express from "express";
import { query, param, body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import validationMiddleware from "../common/middleware/validation.middleware";
import listController from "./list.controller";

class ListRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ListRoutes");
  }

  configureRoutes(): express.Application {
    this.app.route("/api/lists").post(
      body("name").isString().escape(),
      body("description").isString().escape().optional(),
      query("boardId").isInt().toInt(),
      validationMiddleware.validateRequest,
      (req, res, next) => {
        req.body.boardId = req.query.boardId;
        next();
      },
      listController.createList,
    );

    this.app
      .route("/api/lists/:listId")
      .all(
        query("boardId").isInt().toInt(),
        param("listId").isInt().toInt(),
        validationMiddleware.validateRequest,
        (req, res, next) => {
          req.body.listId = req.params.listId;
          req.body.boardId = req.query.boardId;
          next();
        },
      )
      .get(listController.getListById)
      .patch(
        body("name").isString().escape().optional(),
        body("description").isString().escape().optional(),
        validationMiddleware.validateRequest,
        listController.updateList,
      )
      .delete(listController.deleteList);

    return this.app;
  }
}

export default ListRoutes;
