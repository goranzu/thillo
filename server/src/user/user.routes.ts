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
