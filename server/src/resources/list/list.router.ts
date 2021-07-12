import express from "express";
import { body } from "express-validator";
import * as listController from "./list.controller";
import * as validationMiddleware from "../../middleware/validation.middleware";

const router = express.Router();
const param = "listId";

router
  .route("/")
  .get(listController.httpGetAll)
  .post(
    body("name").isString().escape(),
    body("boardId").isInt(),
    body("description").isString().escape().optional(),
    validationMiddleware.requestValidation,
    listController.httpCreateOne,
  );

router
  .route(`/:${param}`)
  .get(validationMiddleware.checkIdParam(param), listController.httpGetOne)
  .put(
    validationMiddleware.checkIdParam(param),
    body("name").isString().escape().optional(),
  );
//     body("description").isString().escape().optional(),
//     validationMiddleware.requestValidation,
//     listController.httpUpdateOne,
//   )
//   .delete(
//     validationMiddleware.checkIdParam(param),
//     listController.httpDeleteOne,
//   );

export default router;
