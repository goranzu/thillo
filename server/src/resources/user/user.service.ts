import appConfig from "../../config";
import { BadUserInputError, NotFoundError } from "../../common/errors";
import { hashPassword, verifyPassword } from "../../common/password";
import { CreateDto } from "./dto/create.dto";
// import * as userDao from "./user.dao";
import userDao from "./user.dao";
import prefixes from "../../common/prefixes";
import redisClient from "../../common/redisClient";
import * as emailService from "../../common/services/email.service";
import { User, UserWithoutPassword } from "../../common/types";
import { generateToken } from "../../common/generateToken";

async function signUp(
  data: CreateDto,
): Promise<{ id: number; email: string; name: string }> {
  const hashedPassword = await hashPassword(data.password);
  const user = await userDao.create({
    ...data,
    password: hashedPassword,
  });

  if (!user) {
    throw new Error("Something went wrong.");
  }

  return { id: user.user_id, email: user.email, name: user.fullName() };
}

interface BaseUser {
  id: number;
  name: string;
  email: string;
}

async function signIn(email: string, password: string): Promise<BaseUser> {
  const user = await userDao.findByEmail(email);

  if (user == null) {
    throw new BadUserInputError("This email is not registered.", "email");
  }

  if (!user.password) {
    throw new Error();
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    throw new BadUserInputError("Invalid password.", "password");
  }

  return {
    id: user.user_id,
    name: user.fullName(),
    email: user.email,
  };
}

async function forgotPassword(email: string): Promise<void> {
  const user = await userDao.findByEmail(email);

  if (user == null) {
    throw new BadUserInputError("This email is not registered.", "email");
  }

  const token = generateToken();

  const link = `Follow this <a href="${appConfig.frontend}/reset-password/${token}">link</a> to reset your password.`;

  await redisClient.set(
    `${prefixes.FORGOT_PASSWORD}${token}`,
    user.user_id,
    "ex",
    1000 * 60 * 60 * 3,
  );

  await emailService.sendEmail(user.email, link);

  return;
}

async function resetPassword(password: string, token: string): Promise<void> {
  const redisKey = `${prefixes.FORGOT_PASSWORD}${token}`;

  const userId = await redisClient.get(redisKey);

  if (userId == null) {
    throw new BadUserInputError("Invalid token.", "token");
  }

  const hashedPassword = await hashPassword(password);

  await userDao.updatePassword(Number(userId), hashedPassword);

  await redisClient.del(redisKey);

  return;
}

async function findByEmail(email: string): Promise<BaseUser> {
  const user = await userDao.findByEmail(email);
  if (user == null) {
    throw new NotFoundError("User not found.");
  }

  return {
    id: user.user_id,
    email: user.email,
    name: user.fullName(),
  };
}

async function listAllUsers(
  limit?: number,
  page?: number,
): Promise<BaseUser[]> {
  const users = await userDao.findMany(limit, page);

  if (users == null) {
    throw new Error();
  }

  return users.map((user) => {
    return {
      id: user.user_id,
      email: user.email,
      name: user.fullName(),
    };
  });
}

export {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  findByEmail,
  listAllUsers,
};
