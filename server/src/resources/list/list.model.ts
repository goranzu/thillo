import { Model } from "objection";
import BoardModel from "../board/board.model";
import UserModel from "../user/user.model";

export default class ListModel extends Model {
  list_id!: number;
  name!: string;
  description?: string;
  creator_id!: string;
  board_id!: string;

  static get tableName(): string {
    return "lists";
  }

  static get idColumn(): string {
    return "list_id";
  }

  static relationMappings = {
    board: {
      relation: Model.BelongsToOneRelation,
      modelClass: BoardModel,
      join: {
        from: "lists.board_id",
        to: "boards.board_id",
      },
    },
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "lists.creator_id",
        to: "users.user_id",
      },
    },
  };

  static jsonSchema = {
    type: "object",
    required: ["name", "creator_id", "board_id"],

    properties: {
      list_id: { type: "integer" },
      name: { type: "string", minLength: 1, maxLength: 100 },
      description: { type: "string", minLength: 1, maxLength: 4000 },
      creator_id: { type: "integer" },
      board_id: { type: "integer" },
    },
  };
}
