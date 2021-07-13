import cuid from "cuid";
import prisma from "../../client";
import appConfig from "../../config";
import { SignupInterface } from "../../types";
import { BadUserInputError } from "../../utils/errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import prefixes from "../../utils/prefixes";
import redisClient from "../../utils/redisClient";
import { sendEmail } from "../../utils/sendEmail";

interface UserInterface {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

const defaultSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  createdAt: true,
  updatedAt: true,
};

async function signUp(data: SignupInterface): Promise<UserInterface> {
  const { hashedPassword, passwordSalt } = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      passwordSalt,
      firstName: data.firstName,
      lastName: data.lastName,
    },
  });

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function signIn(email: string, password: string): Promise<UserInterface> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user == null) {
    throw new BadUserInputError("This email is not registered.", "email");
  }

  const isValidPassword = await verifyPassword(
    password,
    user.password,
    user.passwordSalt,
  );

  if (!isValidPassword) {
    throw new BadUserInputError("Invalid password.", "password");
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function forgotPassword(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (user == null) {
    throw new BadUserInputError("This email is not registered.", "email");
  }

  const token = cuid();

  const link = `Follow this <a href="${appConfig.frontend}/reset-password/${token}">link</a> to reset your password.`;

  await redisClient.set(
    `${prefixes.FORGOT_PASSWORD}${token}`,
    user.id,
    "ex",
    1000 * 60 * 60 * 3,
  );

  await sendEmail(user.email, link);

  return;
}

async function resetPassword(password: string, token: string): Promise<void> {
  const redisKey = `${prefixes.FORGOT_PASSWORD}${token}`;

  const userId = await redisClient.get(redisKey);

  if (userId == null) {
    throw new BadUserInputError("Invalid token.", "token");
  }

  const { hashedPassword, passwordSalt } = await hashPassword(password);

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedPassword, passwordSalt },
  });

  await redisClient.del(redisKey);

  return;
}

async function findByEmail(email: string): Promise<UserInterface | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...defaultSelect },
  });

  if (user) {
    return user;
  } else {
    return null;
  }
}

async function getAllUsers(): Promise<UserInterface[]> {
  const users = await prisma.user.findMany({ select: { ...defaultSelect } });

  return users;
}

export {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  findByEmail,
  getAllUsers,
};
