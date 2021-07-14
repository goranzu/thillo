import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { body, validationResult } from "express-validator";
import { BadUserInputError } from "../utils/errors";
import commonMiddleware from "../common/common.middleware";
import authController from "./auth.controller";
import * as authMiddleware from "../middleware/auth.middleware";
import debug from "debug";

const logger = debug("app:auth.routes");

// router.post(
//     "/signin",
//     body("email").isEmail().normalizeEmail(),
//     body("password").isLength({ min: 4 }),
//     validationMiddleware.requestValidation,
//     authController.httpSignin,
//   );

//   router.get("/me", authMiddleware.protect, authController.httpGetMe);

//   router.delete("/logout", authMiddleware.protect, authController.httpLogout);

//   router.post(
//     "/forgot-password",
//     body("email").isEmail().normalizeEmail(),
//     validationMiddleware.requestValidation,
//     authController.httpForgotPassword,
//   );

//   router.post(
//     "/reset-password",
//     body("password").isLength({ min: 4 }),
//     body("token").isString(),
//     validationMiddleware.requestValidation,
//     authController.httpResetPassword,
//   );

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

    this.app.get("/me", authMiddleware.protect, authController.getMe);

    this.app.delete("/logout", authMiddleware.protect, authController.logout);

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
