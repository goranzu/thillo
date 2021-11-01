import express from "express";
import { body, param } from "express-validator";
import * as authController from "./auth.controller";
import * as authMiddleware from "./auth.middleware";
import * as validationMiddleware from "../common/middleware/validation.middleware";

// import debug from "debug";

// const logger = debug("app:auth.routes");

const router = express.Router();

router.post(
  "/signin",
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 4 }),
  validationMiddleware.validateRequest,
  authController.signIn,
);

router.post(
  "/signup",
  body("firstName").isString(),
  body("lastName").isString(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 4 }),
  validationMiddleware.validateRequest,
  authController.signUp,
);

router.get("/me", authMiddleware.protect, authController.getMe);

router.delete("/logout", authMiddleware.protect, authController.logout);

router.post(
  "/forgot-password",
  body("email").isEmail().normalizeEmail(),
  validationMiddleware.validateRequest,
  authController.forgotPassword,
);

router.post(
  "/reset-password/:token",
  body("password").isLength({ min: 4 }),
  param("token").isString(),
  validationMiddleware.validateRequest,
  authController.resetPassword,
);

export default router;

// export class AuthRoutes extends CommonRoutesConfig {
//   constructor(app: express.Application) {
//     super(app, "AuthRoutes");
//   }

//   configureRoutes(): express.Application {
//     this.app.post(
//       "/signin",
//       body("email").isEmail().normalizeEmail(),
//       body("password").isLength({ min: 4 }),
//       validationMiddleware.validateRequest,
//       authController.signIn,
//     );

//     this.app.post(
//       "/signup",
//       body("firstName").isString(),
//       body("lastName").isString(),
//       body("email").isEmail().normalizeEmail(),
//       body("password").isLength({ min: 4 }),
//       validationMiddleware.validateRequest,
//       authController.signUp,
//     );

//     this.app.get("/me", authMiddleware.protect, authController.getMe);

//     this.app.delete("/logout", authMiddleware.protect, authController.logout);

//     this.app.post(
//       "/forgot-password",
//       body("email").isEmail().normalizeEmail(),
//       validationMiddleware.validateRequest,
//       authController.forgotPassword,
//     );

//     this.app.post(
//       "/reset-password",
//       body("password").isLength({ min: 4 }),
//       body("token").isString(),
//       validationMiddleware.validateRequest,
//       authController.resetPassword,
//     );

//     return this.app;
//   }
// }
