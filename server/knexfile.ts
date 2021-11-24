// Update with your config settings.

export default {
  development: {
    client: "postgresql",
    connection: {
      database: "thillo_dev",
      user: "postgres",
      password: "reacter",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: "db/migrations",
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
