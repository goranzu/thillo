import express from "express";
import { body } from "express-validator";
import * as validationMiddleware from "../common/middleware/validation.middleware";
import * as userController from "./user.controller";

const router = express.Router();

router.post(
  "/api/users/find",
  body("email").isEmail().normalizeEmail(),
  validationMiddleware.validateRequest,
  userController.findByEmail,
);

export default router;

// export class UserRoutes extends CommonRoutesConfig {
//   constructor(app: express.Application) {
//     super(app, "UserRoutes");
//   }

//   configureRoutes(): express.Application {
//     this.app.post(
//       "/api/users/find",
//       body("email").isEmail().normalizeEmail(),
//       validationMiddleware.validateRequest,
//       userController.findByEmail,
//     );

//     return this.app;
//   }
// }
