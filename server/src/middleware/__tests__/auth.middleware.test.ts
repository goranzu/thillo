import { Request, Response } from "express";
import { buildUserWithHashedPassword } from "../../../testUtils";
import redisClient from "../../utils/redisClient";
import prisma from "../../client";
import appConfig from "../../config";
import * as authMiddleware from "../auth.middleware";
import { UnauthorizedError } from "../../utils/errors";

const testEmail = "test@example.com";
const testPassword = "password";

beforeAll(async () => {
  const testUser = await buildUserWithHashedPassword({
    email: testEmail,
  });

  await prisma.user.createMany({ data: [testUser] });
});

afterAll(async () => {
  await redisClient.quit();

  const deleteUser = prisma.user.deleteMany();

  await prisma.$transaction([deleteUser]);

  await prisma.$disconnect();
});

function buildReq(overrides?: Record<string, any>) {
  return { session: {}, body: {}, ...overrides } as Request;
}

function buildRes(overrides?: Record<string, any>) {
  const res = {
    status: jest.fn(() => res).mockName("status"),
    json: jest.fn(() => res).mockName("json"),
    ...overrides,
  } as unknown as Response;
  return res;
}

function buildNext() {
  return jest.fn().mockName("next");
}

test("should return a 401 unauthorized if no user session is present", () => {
  const req = buildReq();
  const res = buildRes();
  const next = buildNext();

  try {
    authMiddleware.protect(req, res, next);
  } catch (error) {
    expect(error).toBeInstanceOf(UnauthorizedError);
    expect(error.message).toMatchInlineSnapshot(`"Not Authorized."`);
    expect(next).toHaveBeenCalledTimes(0);
  }
});

test("should call next if user session is present", () => {
  const userSession = { id: 1 };
  const req = buildReq({ session: { user: userSession } });
  const res = buildRes();
  const next = buildNext();

  authMiddleware.protect(req, res, next);

  expect(req.user).toBe(userSession);

  expect(next).toHaveBeenCalledTimes(1);
});
