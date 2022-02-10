import { Model } from "objection";
import ListModel from "../list/list.model";
import UserModel from "../user/user.model";

export default class CardModel extends Model {
  card_id!: number;
  title!: string;
  description?: string;
  cover_url?: string;
  creator_id!: number;
  list_id!: number;

  static get tableName(): string {
    return "cards";
  }

  static get idColumn(): string {
    return "card_id";
  }

  static relationMappings = {
    creator: {
      relation: Model.BelongsToOneRelation,
      modelClass: UserModel,
      join: {
        from: "cards.creator_id",
        to: "users.user_id",
      },
    },
    list: {
      relation: Model.BelongsToOneRelation,
      modelClass: ListModel,
      join: {
        from: "cards.creator_id",
        to: "lists.list_id",
      },
    },
  };

  static jsonSchema = {
    type: "object",
    required: ["title", "creator_id", "list_id"],

    properties: {
      creator_id: { type: "integer" },
      list_id: { type: "integer" },
      title: { type: "string", minLength: 1, maxLength: 100 },
      description: { type: "string", minLength: 1, maxLength: 1000 },
      cover_url: { type: "string", minLength: 1, maxLength: 500 },
    },
  };
}
