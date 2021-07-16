import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { body } from "express-validator";
import authController from "./auth.controller";
import validationMiddleware from "../common/middleware/validation.middleware";
import authMiddleware from "./auth.middleware";
// import debug from "debug";

// const logger = debug("app:auth.routes");

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(
      "/signin",
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 4 }),
      validationMiddleware.validateRequest,
      authController.signIn,
    );

    this.app.post(
      "/signup",
      body("firstName").isString(),
      body("lastName").isString(),
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 4 }),
      validationMiddleware.validateRequest,
      authController.signUp,
    );

    this.app.get("/me", authMiddleware.protect, authController.getMe);

    this.app.delete("/logout", authMiddleware.protect, authController.logout);

    this.app.post(
      "/forgot-password",
      body("email").isEmail().normalizeEmail(),
      validationMiddleware.validateRequest,
      authController.forgotPassword,
    );

    this.app.post(
      "/reset-password",
      body("password").isLength({ min: 4 }),
      body("token").isString(),
      validationMiddleware.validateRequest,
      authController.resetPassword,
    );

    return this.app;
  }
}
