import prisma from "../client";
import { CreateDto } from "./dto/create.dto";
import { UpdateDto } from "./dto/update.dto";

class UserDao {
  async create(userData: CreateDto & { passwordSalt: Buffer }) {
    const user = await prisma.user.create({
      data: userData,
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    return user;
  }

  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }

  async updateById(id: number, data: UpdateDto) {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return user;
  }

  async getAllUser(limit = 25, page = 0) {
    const users = await prisma.user.findMany({ skip: page, take: limit });
    return users;
  }
}

export default new UserDao();
