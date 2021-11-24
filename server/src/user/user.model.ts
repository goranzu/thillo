import { Model } from "objection";

export default class UserModel extends Model {
  user_id!: number;
  first_name!: string;
  last_name!: string;
  email!: string;
  password!: string;

  static get tableName(): string {
    return "users";
  }

  static get idColumn(): string {
    return "user_id";
  }

  fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  static jsonSchema = {
    type: "object",
    required: ["first_name", "last_name", "email", "password"],

    properties: {
      user_id: { type: "integer" },
      first_name: { type: "string", minLength: 1, maxLength: 254 },
      last_name: { type: "string", minLength: 1, maxLength: 254 },
      email: { type: "string", minLength: 1, maxLength: 254 },
      password: { type: "string", minLength: 1, maxLength: 500 },

      address: {
        type: "object",
        properties: {
          street: { type: "string" },
          city: { type: "string" },
          zipCode: { type: "string" },
        },
      },
    },
  };
}
