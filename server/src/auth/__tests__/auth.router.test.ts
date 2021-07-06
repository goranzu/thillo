import supertest from "supertest";
import { buildAuthUser, buildUserWithHashedPassword } from "../../../testUtils";
import redisClient from "../../utils/redisClient";
import prisma from "../../client";
import { app } from "../../server";
import appConfig from "../../config";
import { sendEmail } from "../../utils/sendEmail";

jest.mock("../../utils/sendEmail");

const testEmail = "test@example.com";
const testPassword = "password";

const request = supertest(app);

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

test("should return 200 on successfull signup", async () => {
  const user = buildAuthUser();
  const response = await request.post("/auth/signup").send(user);

  expect(response.statusCode).toBe(200);
  expect(response.body.data.email).toBe(user.email);
});

test("should return 400 on on bad user input", async () => {
  const user = buildAuthUser({ email: undefined });
  const response = await request.post("/auth/signup").send(user);

  expect(response.statusCode).toBe(400);
  expect(response.body.errors).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Invalid value",
        "param": "email",
        "path": "/auth/signup",
      },
    ]
  `);
});

test("should return 200 on successfull signin", async () => {
  const response = await request
    .post("/auth/signin")
    .send({ email: testEmail, password: testPassword });

  expect(response.statusCode).toBe(200);
  expect(response.body.data.email).toBe(testEmail);
  expect(
    response.headers["set-cookie"][0].startsWith(appConfig.cookieName),
  ).toBeTruthy();
});

test("should return a 400 if email is not registered", async () => {
  const response = await request
    .post("/auth/signin")
    .send({ email: "wrong@email.com", password: testPassword });

  expect(response.statusCode).toBe(400);
  expect(response.body.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "message": "This email is not registered.",
    "stack": "Error: This email is not registered.
    at Object.signIn (/home/goran/dev/goranzu/shopping/server/src/resources/user/user.service.ts:36:11)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at httpSignin (/home/goran/dev/goranzu/shopping/server/src/auth/auth.controller.ts:24:16)",
    "statusCode": 400,
  },
]
`);
});

test("should return a 400 if the wrong password is used", async () => {
  const response = await request
    .post("/auth/signin")
    .send({ email: testEmail, password: "WRONG" });

  expect(response.statusCode).toBe(400);
  expect(response.body.errors).toMatchInlineSnapshot(`
    Array [
      Object {
        "message": "Invalid password.",
        "stack": "Error: Invalid password.
        at Object.signIn (/home/goran/dev/goranzu/shopping/server/src/resources/user/user.service.ts:46:11)
        at httpSignin (/home/goran/dev/goranzu/shopping/server/src/auth/auth.controller.ts:24:16)",
        "statusCode": 400,
      },
    ]
  `);
});

test("should return the logged in user", async () => {
  const loginResponse = await request
    .post("/auth/signin")
    .send({ email: testEmail, password: testPassword });

  const cookie = loginResponse.headers["set-cookie"][0];

  const response = await request.get("/auth/me").set("Cookie", cookie);

  expect(response.statusCode).toBe(200);
  expect(response.body.data.email).toBe(testEmail);
});

test("should clear the cookie on logout", async () => {
  const loginResponse = await request
    .post("/auth/signin")
    .send({ email: testEmail, password: testPassword });

  const cookie = loginResponse.headers["set-cookie"][0];

  const response = await request.delete("/auth/logout").set("Cookie", cookie);

  expect(response.statusCode).toBe(204);
  expect(response.headers["set-cookie"][0]).toMatchInlineSnapshot(
    `"connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT"`,
  );
});

test.skip("should return a 204 on /auth/forgot-password and call sendEmail", async () => {
  const response = await request
    .post("/auth/forgot-password")
    .send({ email: testEmail });

  expect(response.statusCode).toBe(204);
  expect(sendEmail).toHaveBeenCalledTimes(1);
});

test.skip("should return a 400 if email requested is not registered", async () => {
  const response = await request
    .post("/auth/forgot-password")
    .send({ email: "notregistered@email.com" });

  expect(response.statusCode).toBe(400);
  expect(sendEmail).toHaveBeenCalledTimes(0);
  expect(response.body.errors).toMatchInlineSnapshot(`
Array [
  Object {
    "message": "This email is not registered.",
    "stack": "Error: This email is not registered.
    at Object.forgotPassword (/home/goran/dev/goranzu/shopping/server/src/resources/user/user.service.ts:61:11)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at httpForgotPassword (/home/goran/dev/goranzu/shopping/server/src/auth/auth.controller.ts:54:3)",
    "statusCode": 400,
  },
]
`);
});
