import { Model } from "objection";
import ListModel from "../list/list.model";
import UserModel from "../user/user.model";

export default class BoardModel extends Model {
  board_id!: number;
  name!: string;
  is_private?: boolean;
  description?: string;
  creator_id!: number;

  static get tableName(): string {
    return "boards";
  }

  static get idColumn(): string {
    return "board_id";
  }

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "boards.creator_id",
        to: "users.user_id",
      },
    },
    lists: {
      relation: Model.HasManyRelation,
      modelClass: ListModel,
      join: {
        from: "boards.board_id",
        to: "lists.board_id",
      },
    },
    members: {
      relation: Model.ManyToManyRelation,
      modelClass: UserModel,
      join: {
        from: "boards.board_id",
        through: {
          from: "board_members.board_id",
          to: "board_members.member_id",
        },
        to: "users.user_id",
      },
    },
  };

  static jsonSchema = {
    type: "object",
    required: ["name", "creator_id"],

    properties: {
      board_id: { type: "integer" },
      name: { type: "string", minLength: 1, maxLength: 100 },
      description: { type: "string", minLength: 1, maxLength: 4000 },
      is_private: { type: "boolean" },
      creator_id: { type: "integer" },
    },
  };
}
