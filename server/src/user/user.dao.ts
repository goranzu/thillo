import { CreateDto } from "./dto/create.dto";
import UserModel from "./user.model";

class UserDao {
  static async create(data: CreateDto): Promise<UserModel> {
    const user = await UserModel.query().insert({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
    });
    return user;
  }

  static async findByEmail(email: string): Promise<UserModel | undefined> {
    const user = await UserModel.query().findOne("email", "=", email);
    return user;
  }

  static async updatePassword(
    id: number,
    password: string,
  ): Promise<UserModel> {
    const user = await UserModel.query()
      .findById(id)
      .patch({ password })
      .returning("*");
    return user[0];
  }

  static async findMany(limit = 25, page = 0): Promise<UserModel[]> {
    const users = await UserModel.query()
      .limit(limit)
      .offset(page)
      .orderBy("created_at", "DESC");

    return users;
  }
}

export default UserDao;
