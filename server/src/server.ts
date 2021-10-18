// import http from "http";

import express from "express";
import "express-async-errors";
import session from "express-session";
import connectRedis from "connect-redis";
import morgan from "morgan";
import cors from "cors";
// import debug from "debug";

import appConfig from "./config";
import errorHandler from "./common/errorHandler";
import { NotFoundError } from "./common/errors";
import redisClient from "./common/redisClient";
import authRouter from "./auth/auth.routes";
import userRouter from "./user/user.routes";
import boardRouter from "./board/board.routes";
import listRouter from "./list/list.routes";
// import { CommonRoutesConfig } from "./common/common.routes.config";
// import { AuthRoutes } from "./auth/auth.routes";
// import { UserRoutes } from "./user/user.routes";
// import { BoardRoutes } from "./board/board.routes";
// import ListRoutes from "./list/list.routes";
import * as authMiddleware from "./auth/auth.middleware";
import pool from "./db/pool";

const app = express();
// const server = http.createServer(app);
// const routes: CommonRoutesConfig[] = [];
// const logger = debug("app");

const RedisStore = connectRedis(session);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: appConfig.sessionSecret || "topSecret",
    resave: false,
    name: appConfig.cookieName,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
      sameSite: "lax",
      secure: appConfig.ENV === "production",
    },
  }),
);

app.use(
  cors({
    origin: appConfig.frontend,
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const runningMessage = `Server running on http://localhost:${appConfig.port}`;

app.get("/", (req, res) => {
  res.status(200).json({ message: runningMessage });
  return;
});

app.use("/", authRouter);
app.use("/api", authMiddleware.protect);
app.use("/api", userRouter);
app.use("/api", boardRouter);
app.use("/api", listRouter);

app.use(function handle404Erorr() {
  throw new NotFoundError(undefined);
});

app.use(errorHandler);

function start(): void {
  pool
    .connect(appConfig.sql)
    .then(() => {
      app.listen(appConfig.port, () => {
        console.log(runningMessage);
      });
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export { app, start };
