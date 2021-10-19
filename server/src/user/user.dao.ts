import { User, UserWithoutPassword } from "../common/types";
import pool from "../db/pool";
import { CreateDto } from "./dto/create.dto";

class UserDao {
  static async create(
    data: CreateDto & { passwordSalt: Buffer },
  ): Promise<Pick<User, "id" | "email"> | undefined> {
    const result = await pool.query(
      `
            INSERT INTO users ("email", "firstName", "lastName", "password", "passwordSalt")
            VALUES ($1, $2, $3, $4, $5)
            RETURNING "id", "email";
        `,
      [
        data.email,
        data.firstName,
        data.lastName,
        data.password,
        data.passwordSalt,
      ],
    );

    return result?.rows[0];
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const result = await pool.query(
      `
        SELECT id, "firstName", "lastName", email, password, "passwordSalt"
        FROM users
        WHERE email = $1;
    `,
      [email],
    );

    return result?.rows[0];
  }

  static async updatePassword(
    id: number,
    data: { password: string; passwordSalt: Buffer },
  ): Promise<Pick<User, "id" | "email"> | undefined> {
    const result = await pool.query(
      `
        UPDATE users
        SET password = $2, "passwordSalt" = $3
        WHERE id = $1
        RETURNING id, email;
      `,
      [id, data.password, data.passwordSalt],
    );

    return result?.rows[0];
  }

  static async findMany(
    limit = 25,
    page = 0,
  ): Promise<UserWithoutPassword[] | undefined> {
    const results = await pool.query(
      `
        SELECT id, email, "firstName", "lastName", email
        FROM users
        ORDER BY "createdAt",
        LIMIT $1 OFFSET $2;
      `,
      [limit, page],
    );

    return results?.rows;
  }
}

export default UserDao;
