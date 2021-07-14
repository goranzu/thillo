import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { body } from "express-validator";
import commonMiddleware from "../common/common.middleware";
import authController from "./auth.controller";
import debug from "debug";

const logger = debug("app:auth.routes");

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post(
      "/signin",
      (req, res, next) => {
        logger(req.body);
        next();
      },
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 4 }),
      commonMiddleware.validateRequest,
      authController.signIn,
    );

    this.app.post(
      "/signup",
      body("firstName").isString(),
      body("lastName").isString(),
      body("email").isEmail().normalizeEmail(),
      body("password").isLength({ min: 4 }),
      commonMiddleware.validateRequest,
      authController.signUp,
    );

    this.app.get("/me", commonMiddleware.protect, authController.getMe);

    this.app.delete("/logout", commonMiddleware.protect, authController.logout);

    this.app.post(
      "/forgot-password",
      body("email").isEmail().normalizeEmail(),
      commonMiddleware.validateRequest,
      authController.forgotPassword,
    );

    this.app.post(
      "/reset-password",
      body("password").isLength({ min: 4 }),
      body("token").isString(),
      commonMiddleware.validateRequest,
      authController.resetPassword,
    );

    return this.app;
  }
}
