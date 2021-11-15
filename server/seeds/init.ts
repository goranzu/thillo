import faker from "faker";
import { hashPassword } from "../src/common/password";
import appConfig from "../src/config";
import pool from "../src/db/pool";

async function insertUsers(): Promise<void> {
  await pool.connect(appConfig.sql);
  const password = await hashPassword("test");
  const testUser = {
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@example.com",
    password,
  };

  for (let i = 1; i < 21; i += 1) {
    const user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await pool.query(
      `
            INSERT INTO users ("firstName", "lastName", email, password)
            VALUES ($1, $2, $3, $4);
        `,
      [user.firstName, user.lastName, user.email, user.password],
    );
  }
  await pool.query(
    `
          INSERT INTO users ("firstName", "lastName", email, password)
          VALUES ($1, $2, $3, $4);
      `,
    [testUser.firstName, testUser.lastName, testUser.email, testUser.password],
  );
}

insertUsers()
  .then(() => {
    console.log("done");
  })
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await pool.close();
    process.exit(1);
  });
