// import crypto from "crypto";
// import { mocked } from "ts-jest/utils";
// import { prismaMock } from "../../../../singleton";
// import * as userService from "../user.service";
// import { buildUser } from "../../../../testUtils";
// import redisClient from "../../../utils/redisClient";
// import * as passwordUtils from "../../../utils/password";

// jest.mock("../../../utils/password");

// afterEach(async () => {
//   await redisClient.quit();
// });

// test("should create a new user on signup", async () => {
//   const user = buildUser();

//   const SALT = crypto.randomBytes(32);
//   const FAKE_PASSWORD = "FAKE_PASSWORD";

//   mocked(passwordUtils.hashPassword).mockResolvedValueOnce({
//     passwordSalt: SALT,
//     hashedPassword: FAKE_PASSWORD,
//   });

//   prismaMock.user.create.mockResolvedValueOnce({
//     ...user,
//     password: FAKE_PASSWORD,
//     passwordSalt: SALT,
//   });

//   const result = await userService.signUp(user.email, user.password);

//   expect(result.id).toEqual(user.id);
//   expect(result.email).toEqual(user.email);
//   expect(passwordUtils.hashPassword).toHaveBeenCalledTimes(1);
//   expect(passwordUtils.hashPassword).toHaveBeenCalledWith(user.password);
// });

import * as userService from "../user.service";
import * as mail from "../../../utils/sendEmail";
import { buildUserWithHashedPassword } from "../../../../testUtils";
import prisma from "../../../client";
import redisClient from "../../../utils/redisClient";
import { BadUserInputError } from "../../../utils/errors";

jest.mock("../../../utils/sendEmail");

const testEmail = "test@example.com";
const testPassword = "password";

beforeEach(async () => {
  const testUser = await buildUserWithHashedPassword({
    email: testEmail,
  });

  await prisma.user.createMany({ data: [testUser] });
});

afterEach(async () => {
  const deleteUser = prisma.user.deleteMany();

  await prisma.$transaction([deleteUser]);
});

afterAll(async () => {
  await redisClient.quit();

  await prisma.$disconnect();
});

test("should call sendEmail", async () => {
  await userService.forgotPassword(testEmail);

  expect(mail.sendEmail).toHaveBeenCalledTimes(1);
});

test("should throw a 401 unauthorized if email is not registerd", async () => {
  expect.assertions(2);
  try {
    await userService.forgotPassword("wrong@email.com");
  } catch (error) {
    expect(error).toBeInstanceOf(BadUserInputError);
    expect(error.message).toMatchInlineSnapshot(
      `"This email is not registered."`,
    );
  }
});
