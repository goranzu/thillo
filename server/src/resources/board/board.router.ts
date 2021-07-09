import express from "express";
import * as boardController from "./board.controller";

const router = express.Router();

router.route("/").get(boardController.httpGetAll);

export default router;
