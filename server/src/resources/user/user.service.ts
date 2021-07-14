import cuid from "cuid";
import appConfig from "../../config";
import { BadUserInputError } from "../../utils/errors";
import { hashPassword, verifyPassword } from "../../utils/password";
import prefixes from "../../utils/prefixes";
import redisClient from "../../utils/redisClient";
import { sendEmail } from "../../utils/sendEmail";
import { CreateDto } from "./dto/create.dto";
import userDao from "./user.dao";

class UserService {
  async signUp(data: CreateDto) {
    const { passwordSalt, hashedPassword } = await hashPassword(data.password);
    const user = await userDao.create({
      ...data,
      password: hashedPassword,
      passwordSalt,
    });
    return user;
  }

  async signIn(email: string, password: string) {
    const user = await userDao.findByEmail(email);

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
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }

  async forgotPassword(email: string) {
    const user = await userDao.findByEmail(email);

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

  async resetPassword(password: string, token: string) {
    const redisKey = `${prefixes.FORGOT_PASSWORD}${token}`;

    const userId = await redisClient.get(redisKey);

    if (userId == null) {
      throw new BadUserInputError("Invalid token.", "token");
    }

    const { hashedPassword, passwordSalt } = await hashPassword(password);

    await userDao.updateById(Number(userId), {
      password: hashedPassword,
      passwordSalt,
    });

    await redisClient.del(redisKey);

    return;
  }

  async findByEmail(email: string) {
    const user = await userDao.findByEmail(email);
    return user;
  }

  async listAllUsers(limit?: number, page?: number) {
    const users = await userDao.getAllUser(limit, page);
    return users;
  }
}

export default new UserService();
