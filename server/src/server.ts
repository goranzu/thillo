import express from "express";
import "express-async-errors";
import session from "express-session";
import connectRedis from "connect-redis";
import morgan from "morgan";
import cors from "cors";

import appConfig from "./config";
import authRouter from "./auth/auth.router";
import boardRouter from "./resources/board/board.router";
import userRouter from "./resources/user/user.router";
import * as authMiddleware from "./middleware/auth.middleware";
import errorHandler from "./errorHandler";
import { NotFoundError } from "./utils/errors";
import redisClient from "./utils/redisClient";

const app = express();

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

app.get("/", (req, res) => {
  res.status(200).json({ message: "✌✌✌✌" });
  return;
});

app.use("/auth", authRouter);
app.use("/api", authMiddleware.protect);
app.use("/api/boards", boardRouter);
app.use("/api/users", userRouter);

app.use(function handle404Erorr() {
  throw new NotFoundError(undefined);
});

app.use(errorHandler);

function start(): void {
  app.listen(appConfig.port, () => {
    console.log(`Listening on http://localhost:${appConfig.port}`);
  });
}

export { start, app };
