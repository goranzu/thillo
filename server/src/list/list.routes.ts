import express from "express";
import { query, param } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import validationMiddleware from "../common/middleware/validation.middleware";
import listController from "./list.controller";

class ListRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "ListRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/api/lists/:listId")
      .get(
        query("boardId").isInt().toInt(),
        param("listId").isInt().toInt(),
        validationMiddleware.validateRequest,
        listController.getListById,
      );

    return this.app;
  }
}

export default ListRoutes;
