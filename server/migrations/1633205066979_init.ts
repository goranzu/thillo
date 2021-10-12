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

  pgm.createTable(
    tableNames.boards,
    {
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
    },
    {
      constraints: {
        unique: ["name", "creatorId"],
      },
    },
  );

  pgm.createTable(
    tableNames.lists,
    {
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
    },
    {
      constraints: {
        unique: ["name", "boardId"],
      },
    },
  );

  pgm.createTable(
    tableNames.boardMembers,
    {
      memberId: {
        type: "INTEGER",
        notNull: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: '"users"',
      },
      boardId: {
        type: "INTEGER",
        notNull: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: '"boards"',
      },
      createdAt: "createdAt",
    },
    {
      constraints: {
        primaryKey: ["memberId", "boardId"],
      },
    },
  );

  pgm.createTable(tableNames.cards, {
    id: "id",
    title: textColumn(true),
    description: textColumn(false),
    coverUrl: textColumn(false),
    listId: {
      type: "INTEGER",
      notNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: '"lists"',
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

  pgm.createTable(
    tableNames.cardComments,
    {
      authorId: {
        type: "INTEGER",
        notNull: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: '"users"',
      },
      cardId: {
        type: "INTEGER",
        notNull: true,
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        references: '"cards"',
      },
      text: textColumn(true),
      createdAt: "createdAt",
    },
    {
      constraints: {
        primaryKey: ["authorId", "cardId"],
      },
    },
  );

  pgm.createTable(tableNames.cardAttachments, {
    id: "id",
    url: textColumn(true),
    cardId: {
      type: "INTEGER",
      notNull: true,
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      references: '"cards"',
    },
    createdAt: "createdAt",
  });

  //   pgm.createIndex(tableNames.boards, ["name", "creatorId"], { unique: true });
  //   pgm.createIndex(tableNames.lists, ["name", "boardId"], { unique: true });
  //   pgm.addConstraint(tableNames.boardMembers, )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable(tableNames.cardAttachments);
  pgm.dropTable(tableNames.cardComments);
  pgm.dropTable(tableNames.boardMembers);
  pgm.dropTable(tableNames.cards);
  pgm.dropTable(tableNames.lists);
  pgm.dropTable(tableNames.boards);
  pgm.dropTable(tableNames.users);
}
