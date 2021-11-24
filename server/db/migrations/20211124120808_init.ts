import { Knex } from "knex";

const tableNames = {
  users: "users",
  boards: "boards",
  lists: "lists",
  boardMembers: "board_members",
  cards: "cards",
  cardAttachments: "card_attachments",
  cardComments: "card_comments",
};

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableNames.users, (table) => {
    table.increments("user_id");
    table.string("first_name", 254).notNullable();
    table.string("last_name", 254).notNullable();
    table.string("email", 254).notNullable();
    table.string("password", 500).notNullable;
    table.timestamps(false, true);

    table.unique(["email"], { indexName: "users_email_key" });
  });

  await knex.schema.createTable(tableNames.boards, (table) => {
    table.increments("board_id");
    table.string("name", 100).notNullable();
    table.boolean("is_private").defaultTo(true);
    table.string("description", 4000);
    table.integer("creator_id").unsigned().notNullable();
    table.timestamps(false, true);

    table.unique(["name", "creator_id"], {
      indexName: "boards_name_creator_id_key",
    });
  });

  await knex.schema.createTable(tableNames.lists, (table) => {
    table.increments("list_id");
    table.string("name", 100).notNullable();
    table.string("description", 4000);
    table.integer("creator_id").unsigned().notNullable();
    table.integer("board_id").unsigned().notNullable();
    table.timestamps(false, true);

    table.unique(["name", "board_id"], {
      indexName: "lists_name_board_id_key",
    });
  });

  await knex.schema.createTable(tableNames.boardMembers, (table) => {
    table.integer("member_id").unsigned().notNullable();
    table.integer("board_id").unsigned().notNullable();
    table.timestamps(false, true);

    table.primary(["member_id", "board_id"], {
      constraintName: "board_members_pkey",
    });
  });

  await knex.schema.createTable(tableNames.cards, (table) => {
    table.increments("card_id");
    table.string("title", 100).notNullable();
    table.string("description", 1000);
    table.string("cover_url", 500);
    table.integer("creator_id").unsigned().notNullable();
    table.integer("list_id").unsigned().notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.createTable(tableNames.cardComments, (table) => {
    table.string("text", 1000);
    table.integer("card_id").unsigned().notNullable();
    table.integer("creator_id").unsigned().notNullable();
    table.timestamps(false, true);

    table.primary(["card_id", "creator_id"], {
      constraintName: "card_comments_pkey",
    });
  });

  await knex.schema.createTable(tableNames.cardAttachments, (table) => {
    table.increments("card_attachments_id");
    table.string("url", 1000);
    table.integer("card_id").unsigned().notNullable();
    table.timestamps(false, true);
  });

  await knex.schema.alterTable(tableNames.boards, (table) => {
    table
      .foreign("creator_id")
      .references("users.user_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });

  await knex.schema.alterTable(tableNames.lists, (table) => {
    table
      .foreign("creator_id")
      .references("users.user_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });

  await knex.schema.alterTable(tableNames.cardAttachments, (table) => {
    table
      .foreign("card_id")
      .references("cards.card_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });

  await knex.schema.alterTable(tableNames.cards, (table) => {
    table
      .foreign("creator_id")
      .references("users.user_id")
      .onDelete("cascade")
      .onUpdate("cascade");

    table
      .foreign("list_id")
      .references("lists.list_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });

  await knex.schema.alterTable(tableNames.cardComments, (table) => {
    table
      .foreign("creator_id")
      .references("users.user_id")
      .onDelete("cascade")
      .onUpdate("cascade");

    table
      .foreign("card_id")
      .references("cards.card_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });

  await knex.schema.alterTable(tableNames.boardMembers, (table) => {
    table
      .foreign("board_id")
      .references("boards.board_id")
      .onDelete("cascade")
      .onUpdate("cascade");

    table
      .foreign("member_id")
      .references("users.user_id")
      .onDelete("cascade")
      .onUpdate("cascade");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableNames.cardAttachments);
  await knex.schema.dropTable(tableNames.cardComments);
  await knex.schema.dropTable(tableNames.boardMembers);
  await knex.schema.dropTable(tableNames.cards);
  await knex.schema.dropTable(tableNames.lists);
  await knex.schema.dropTable(tableNames.boards);
  await knex.schema.dropTable(tableNames.users);
}
