// Update with your config settings.
import type { Knex } from "knex";
import appConfig from "./src/config";

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: appConfig.sql.database,
      user: appConfig.sql.user,
      password: appConfig.sql.password,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "db/migrations",
      tableName: "migrations",
    },
    seeds: {
      directory: "db/seeds",
    },
  },

  //   staging: {
  //     client: "postgresql",
  //     connection: {
  //       database: "my_db",
  //       user: "username",
  //       password: "password",
  //     },
  //     pool: {
  //       min: 2,
  //       max: 10,
  //     },
  //     migrations: {
  //       tableName: "knex_migrations",
  //     },
  //   },

  //   production: {
  //     client: "postgresql",
  //     connection: {
  //       database: "my_db",
  //       user: "username",
  //       password: "password",
  //     },
  //     pool: {
  //       min: 2,
  //       max: 10,
  //     },
  //     migrations: {
  //       tableName: "knex_migrations",
  // },
  //   },
};

module.exports = config;
