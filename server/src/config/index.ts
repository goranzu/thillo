import "dotenv";
import assert from "assert";
import { PoolConfig } from "pg";

const ENV = process.env.NODE_ENV || "development";

const { PGDATABASE, PGUSER, PGHOST, PGPASSWORD, PGPORT, SESSION_SECRET } =
  process.env;

assert(PGDATABASE, "env variable PGDATABASE must be defined");
assert(PGUSER, "env variable PGUSER must be defined");
assert(PGHOST, "env variable PGHOST must be defined");
assert(PGPASSWORD, "env variable PGPASSWORD must be defined");
assert(PGPORT, "env variable PGPORT must be defined");
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
    database: PGDATABASE,
    user: PGUSER,
    host: PGHOST,
    password: PGPASSWORD,
    port: Number(PGPORT),
  } as PoolConfig,
} as const;

export default appConfig;
