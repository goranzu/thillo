import { Model } from "objection";
import BoardModel from "../board/board.model";
import ListModel from "../list/list.model";

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

  static relationMappings = {
    boards: {
      relation: Model.HasManyRelation,
      modelClass: BoardModel,
      join: {
        from: "users.user_id",
        to: "boards.creator_id",
      },
    },
    lists: {
      relation: Model.HasManyRelation,
      modelClass: ListModel,
      join: {
        from: "users.user_id",
        to: "lists.creator_id",
      },
    },
    memberships: {
      relation: Model.ManyToManyRelation,
      modelClass: BoardModel,
      join: {
        from: "users.user_id",
        through: {
          from: "board_members.member_id",
          to: "board_members.board_id",
        },
        to: "boards.board_id",
      },
    },
  };

  static jsonSchema = {
    type: "object",
    required: ["first_name", "last_name", "email", "password"],

    properties: {
      user_id: { type: "integer" },
      first_name: { type: "string", minLength: 1, maxLength: 254 },
      last_name: { type: "string", minLength: 1, maxLength: 254 },
      email: { type: "string", minLength: 1, maxLength: 254 },
      password: { type: "string", minLength: 1, maxLength: 500 },
    },
  };
}
