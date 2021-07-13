import express from "express";
import { body } from "express-validator";
import * as validationMiddleware from "../../middleware/validation.middleware";
import * as userController from "./user.controller";

const router = express.Router();

router.get("/", userController.httpGetAllUsers);

router.post(
  "/find",
  body("email").isEmail().normalizeEmail(),
  validationMiddleware.requestValidation,
  userController.httpFindByEmail,
);

export default router;
