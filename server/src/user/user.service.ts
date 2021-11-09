import appConfig from "../config";
import { BadUserInputError, NotFoundError } from "../common/errors";
import { hashPassword, verifyPassword } from "../common/password";
import { CreateDto } from "./dto/create.dto";
// import * as userDao from "./user.dao";
import userDao from "./user.dao";
import prefixes from "../common/prefixes";
import redisClient from "../common/redisClient";
import * as emailService from "../common/services/email.service";
import { User, UserWithoutPassword } from "../common/types";
import { generateToken } from "../common/generateToken";

async function signUp(data: CreateDto): Promise<Pick<User, "id" | "email">> {
  const hashedPassword = await hashPassword(data.password);
  const user = await userDao.create({
    ...data,
    password: hashedPassword,
  });

  if (!user) {
    throw new Error("Something went wrong.");
  }

  return user;
}

async function signIn(
  email: string,
  password: string,
): Promise<UserWithoutPassword> {
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
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
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
    user.id,
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

  await userDao.updatePassword(Number(userId), {
    password: hashedPassword,
  });

  await redisClient.del(redisKey);

  return;
}

async function findByEmail(email: string): Promise<UserWithoutPassword> {
  const user = await userDao.findByEmail(email);
  if (user == null) {
    throw new NotFoundError("User not found.");
  }

  delete user.password;

  return user;
}

async function listAllUsers(
  limit?: number,
  page?: number,
): Promise<UserWithoutPassword[]> {
  const users = await userDao.findMany(limit, page);

  if (users == null) {
    throw new Error();
  }

  return users;
}

export {
  signUp,
  signIn,
  forgotPassword,
  resetPassword,
  findByEmail,
  listAllUsers,
};

// class UserService {
//   async signUp(data: CreateDto) {
//     const { passwordSalt, hashedPassword } = await hashPassword(data.password);
//     const user = await userDao.create({
//       ...data,
//       password: hashedPassword,
//       passwordSalt,
//     });
//     return user;
//   }

//   async signIn(email: string, password: string) {
//     const user = await userDao.findByEmail(email);

//     if (user == null) {
//       throw new BadUserInputError("This email is not registered.", "email");
//     }

//     const isValidPassword = await verifyPassword(
//       password,
//       user.password,
//       user.passwordSalt,
//     );

//     if (!isValidPassword) {
//       throw new BadUserInputError("Invalid password.", "password");
//     }

//     return {
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//     };
//   }

//   async forgotPassword(email: string) {
//     const user = await userDao.findByEmail(email);

//     if (user == null) {
//       throw new BadUserInputError("This email is not registered.", "email");
//     }

//     const token = cuid();

//     const link = `Follow this <a href="${appConfig.frontend}/reset-password/${token}">link</a> to reset your password.`;

//     await redisClient.set(
//       `${prefixes.FORGOT_PASSWORD}${token}`,
//       user.id,
//       "ex",
//       1000 * 60 * 60 * 3,
//     );

//     await emailService.sendEmail(user.email, link);

//     return;
//   }

//   async resetPassword(password: string, token: string) {
//     const redisKey = `${prefixes.FORGOT_PASSWORD}${token}`;

//     const userId = await redisClient.get(redisKey);

//     if (userId == null) {
//       throw new BadUserInputError("Invalid token.", "token");
//     }

//     const { hashedPassword, passwordSalt } = await hashPassword(password);

//     await userDao.updateById(Number(userId), {
//       password: hashedPassword,
//       passwordSalt,
//     });

//     await redisClient.del(redisKey);

//     return;
//   }

//   async findByEmail(email: string) {
//     const user = await userDao.findByEmail(email);
//     if (user == null) {
//       throw new NotFoundError("User not found.");
//     }
//     return user;
//   }

//   async listAllUsers(limit?: number, page?: number) {
//     const users = await userDao.getAllUser(limit, page);
//     return users;
//   }
// }

// export default new UserService();
