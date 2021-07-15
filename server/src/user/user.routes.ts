import express from "express";
import { body } from "express-validator";
import commonMiddleware from "../common/common.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import userController from "./user.controller";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(
      "/api/users/find",
      body("email").isEmail().normalizeEmail(),
      commonMiddleware.validateRequest,
      userController.findByEmail,
    );

    return this.app;
  }
}
