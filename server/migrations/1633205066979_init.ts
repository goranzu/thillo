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
};

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable(tableNames.users, {
    id: "id",
    email: {
      ...textColumn(true),
      unique: true,
    },
    firstName: textColumn(true),
    lastName: textColumn(true),
    password: textColumn(true),
    passwordSalt: {
      type: "BYTEA",
      notNull: true,
    },
    createdAt: "createdAt",
  });

  pgm.createTable(tableNames.boards, {
    id: "id",
    name: textColumn(true),
    isPrivate: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
    description: textColumn(false),
    creatorId: {
      type: "INTEGER",
      notNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: '"users"',
    },
    createdAt: "createdAt",
  });

  pgm.createTable(tableNames.lists, {
    id: "id",
    name: textColumn(true),
    description: textColumn(false),
    boardId: {
      type: "INTEGER",
      notNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: '"boards"',
    },
    creatorId: {
      type: "INTEGER",
      notNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: '"users"',
    },
    createdAt: "createdAt",
  });

  pgm.createIndex(tableNames.boards, ["name", "creatorId"], { unique: true });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(tableNames.lists);
  pgm.dropTable(tableNames.boards);
  pgm.dropTable(tableNames.users);
}
