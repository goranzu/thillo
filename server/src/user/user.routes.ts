import express from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import validationMiddleware from "../common/middleware/validation.middleware";
import userController from "./user.controller";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UserRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(
      "/api/users/find",
      body("email").isEmail().normalizeEmail(),
      validationMiddleware.validateRequest,
      userController.findByEmail,
    );

    return this.app;
  }
}
