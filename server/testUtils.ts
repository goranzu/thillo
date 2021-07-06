import faker from "faker";
import { hashPassword } from "./src/utils/password";

function buildUser(overrides?: Record<string, any>): {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  id: number;
} {
  const password = faker.internet.password();
  return {
    id: 1,
    email: faker.internet.email(),
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

async function buildUserWithHashedPassword(
  overrides?: Record<string, any>,
): Promise<{
  email: string;
  password: string;
  passwordSalt: Buffer;
}> {
  const { hashedPassword, passwordSalt } = await hashPassword("password");
  return {
    email: faker.internet.email(),
    password: hashedPassword,
    passwordSalt,
    ...overrides,
  };
}

function buildAuthUser(overrides?: Record<string, any>): {
  email: string;
  password: string;
} {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overrides,
  };
}

export { buildUser, buildUserWithHashedPassword, buildAuthUser };
