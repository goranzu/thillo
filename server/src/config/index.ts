import "dotenv";

const ENV = process.env.NODE_ENV || "development";

const appConfig = {
  ENV,
  isDev: ENV === "development",
  port: 3000,
  sessionSecret: process.env.SESSION_SECRET,
  cookieName: "connect.sid",
  frontend: "http://localhost:8080",
  //   redisPort: ENV === "test" ? 6380 : 6379,
} as const;

export default appConfig;
