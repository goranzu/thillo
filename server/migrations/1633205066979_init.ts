/* eslint-disable @typescript-eslint/naming-convention */
import {
  MigrationBuilder,
  ColumnDefinitions,
  PgLiteral,
} from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = {
  createdAt: {
    type: "TIMESTAMP",
    notNull: true,
    default: new PgLiteral("current_timestamp"),
  },
};

function textColumn(notNull: boolean) {
  return {
    type: "TEXT",
    notNull,
  };
}

const tableNames = {
  users: "users",
  boards: "boards",
  lists: "lists",
  boardMembers: "boardMembers",
  cards: "cards",
  cardComments: "cardComments",
  cardAttachments: "cardAttachments",
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY NOT NULL,
            "firstName" VARCHAR(254) NOT NULL,
            "lastName" VARCHAR(254) NOT NULL,
            email VARCHAR(254) UNIQUE NOT NULL,
            password VARCHAR(500) NOT NULL,
            "passwordSalt" BYTEA NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        );

        CREATE TABLE boards (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            "isPrivate" BOOLEAN NOT NULL DEFAULT false,
            description VARCHAR(1000),
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (name, "creatorId");
        );

        CREATE TABLE lists (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "boardId" INTEGER REFERENCES boards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            UNIQUE (name, "boardId");
        );

        CREATE TABLE "boardMembers" (
            "memberId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "boardId" INTEGER REFERENCES boards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY ("memberId", "boardId");
        );

        CREATE TABLE cards (
            id SERIAL PRIMARY KEY NOT NULL,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "coverUrl" VARCHAR(500),
            "listId" INTEGER REFERENCES lists(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        );

        CREATE TABLE "cardComments" (
            text VARCHAR(4000) NOT NULL,
            "cardId" INTEGER REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY ("creatorId", "cardId");
        );

        CREATE TABLE "cardAttachments" (
            id SERIAL PRIMARY KEY NOT NULL,
            url VARCHAR(1000) NOT NULL,
            "cardId" INTEGER REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
        );
    `);
  //   pgm.createTable(tableNames.users, {
  //     id: "id",
  //     email: {
  //       ...textColumn(true),
  //       unique: true,
  //     },
  //     firstName: textColumn(true),
  //     lastName: textColumn(true),
  //     password: textColumn(true),
  //     passwordSalt: {
  //       type: "BYTEA",
  //       notNull: true,
  //     },
  //     createdAt: "createdAt",
  //   });

  //   pgm.createTable(
  //     tableNames.boards,
  //     {
  //       id: "id",
  //       name: textColumn(true),
  //       isPrivate: {
  //         type: "BOOLEAN",
  //         notNull: true,
  //         default: false,
  //       },
  //       description: textColumn(false),
  //       creatorId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"users"',
  //       },
  //       createdAt: "createdAt",
  //     },
  //     {
  //       constraints: {
  //         unique: ["name", "creatorId"],
  //       },
  //     },
  //   );

  //   pgm.createTable(
  //     tableNames.lists,
  //     {
  //       id: "id",
  //       name: textColumn(true),
  //       description: textColumn(false),
  //       boardId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"boards"',
  //       },
  //       creatorId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"users"',
  //       },
  //       createdAt: "createdAt",
  //     },
  //     {
  //       constraints: {
  //         unique: ["name", "boardId"],
  //       },
  //     },
  //   );

  //   pgm.createTable(
  //     tableNames.boardMembers,
  //     {
  //       memberId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"users"',
  //       },
  //       boardId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"boards"',
  //       },
  //       createdAt: "createdAt",
  //     },
  //     {
  //       constraints: {
  //         primaryKey: ["memberId", "boardId"],
  //       },
  //     },
  //   );

  //   pgm.createTable(tableNames.cards, {
  //     id: "id",
  //     title: textColumn(true),
  //     description: textColumn(false),
  //     coverUrl: textColumn(false),
  //     listId: {
  //       type: "INTEGER",
  //       notNull: true,
  //       onDelete: "CASCADE",
  //       onUpdate: "CASCADE",
  //       references: '"lists"',
  //     },
  //     creatorId: {
  //       type: "INTEGER",
  //       notNull: true,
  //       onDelete: "CASCADE",
  //       onUpdate: "CASCADE",
  //       references: '"users"',
  //     },
  //     createdAt: "createdAt",
  //   });

  //   pgm.createTable(
  //     tableNames.cardComments,
  //     {
  //       authorId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"users"',
  //       },
  //       cardId: {
  //         type: "INTEGER",
  //         notNull: true,
  //         onDelete: "CASCADE",
  //         onUpdate: "CASCADE",
  //         references: '"cards"',
  //       },
  //       text: textColumn(true),
  //       createdAt: "createdAt",
  //     },
  //     {
  //       constraints: {
  //         primaryKey: ["authorId", "cardId"],
  //       },
  //     },
  //   );

  //   pgm.createTable(tableNames.cardAttachments, {
  //     id: "id",
  //     url: textColumn(true),
  //     cardId: {
  //       type: "INTEGER",
  //       notNull: true,
  //       onDelete: "CASCADE",
  //       onUpdate: "CASCADE",
  //       references: '"cards"',
  //     },
  //     createdAt: "createdAt",
  //   });

  //   pgm.createIndex(tableNames.boards, ["name", "creatorId"], { unique: true });
  //   pgm.createIndex(tableNames.lists, ["name", "boardId"], { unique: true });
  //   pgm.addConstraint(tableNames.boardMembers, )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
        DROP TABLE "cardAttachments";
        DROP TABLE "cardComments";
        DROP TABLE "boardMembers";
        DROP TABLE cards;
        DROP TABLE lists;
        DROP TABLE boards;
        DROP TABLE users;
    `);

  //   pgm.dropTable(tableNames.cardAttachments);
  //   pgm.dropTable(tableNames.cardComments);
  //   pgm.dropTable(tableNames.boardMembers);
  //   pgm.dropTable(tableNames.cards);
  //   pgm.dropTable(tableNames.lists);
  //   pgm.dropTable(tableNames.boards);
  //   pgm.dropTable(tableNames.users);
}
