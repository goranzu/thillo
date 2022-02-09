import "dotenv/config";
import assert from "assert";

const ENV = process.env.NODE_ENV || "development";

const { PG_DATABASE, PG_USER, PG_HOST, PG_PASSWORD, PG_PORT, SESSION_SECRET } =
  process.env;

assert(PG_DATABASE, "env variable PGDATABASE must be defined");
assert(PG_USER, "env variable PGUSER must be defined");
assert(PG_HOST, "env variable PGHOST must be defined");
assert(PG_PASSWORD, "env variable PGPASSWORD must be defined");
assert(PG_PORT, "env variable PGPORT must be defined");
assert(SESSION_SECRET, "env variable SESSION_SECRET must be defined");

const appConfig = {
  ENV,
  isDev: ENV === "development",
  port: 3000,
  sessionSecret: SESSION_SECRET,
  cookieName: "connect.sid",
  frontend: "http://localhost:8080",
  //   redisPort: ENV === "test" ? 6380 : 6379,
  sql: {
    database: PG_DATABASE,
    user: PG_USER,
    host: PG_HOST,
    password: PG_PASSWORD,
    port: Number(PG_PORT),
  },
} as const;

export default appConfig;
