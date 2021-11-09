import faker from "faker";
import { hashPassword } from "./src/common/password";

interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

function buildUser(overrides?: Record<string, any>): User & {
  createdAt: Date;
  updatedAt: Date;
  id: number;
} {
  const password = faker.internet.password();
  return {
    id: 1,
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

async function buildUserWithHashedPassword(
  overrides?: Record<string, any>,
): Promise<User> {
  const hashedPassword = await hashPassword("password");
  return {
    email: faker.internet.email(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    password: hashedPassword,
    ...overrides,
  };
}

function buildAuthUser(overrides?: Record<string, any>): User {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    ...overrides,
  };
}

export { buildUser, buildUserWithHashedPassword, buildAuthUser };
