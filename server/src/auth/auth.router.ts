import express from "express";
import { body } from "express-validator";

import * as authController from "./auth.controller";
import * as validationMiddleware from "../middleware/validation.middleware";
import * as authMiddleware from "../middleware/auth.middleware";

const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 4 }),
  validationMiddleware.requestValidation,
  authController.httpSignup,
);

router.post(
  "/signin",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 4 }),
  validationMiddleware.requestValidation,
  authController.httpSignin,
);

router.get("/me", authMiddleware.protect, authController.httpGetMe);

router.delete("/logout", authMiddleware.protect, authController.httpLogout);

router.post(
  "/forgot-password",
  body("email").isEmail().normalizeEmail(),
  validationMiddleware.requestValidation,
  authController.httpForgotPassword,
);

router.post(
  "/reset-password",
  body("password").isLength({ min: 4 }),
  body("token").isString(),
  validationMiddleware.requestValidation,
  authController.httpResetPassword,
);

export default router;
