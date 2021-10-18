/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
        CREATE TABLE users (
            id SERIAL NOT NULL,
            "firstName" VARCHAR(254) NOT NULL,
            "lastName" VARCHAR(254) NOT NULL,
            email VARCHAR(254) UNIQUE NOT NULL,
            password VARCHAR(500) NOT NULL,
            "passwordSalt" BYTEA NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id)
        );

        CREATE TABLE boards (
            id SERIAL NOT NULL,
            name VARCHAR(100) NOT NULL,
            "isPrivate" BOOLEAN NOT NULL DEFAULT false,
            description VARCHAR(1000),
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            UNIQUE (name, "creatorId"),
            PRIMARY KEY (id)
        );

        CREATE TABLE lists (
            id SERIAL NOT NULL,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "boardId" INTEGER REFERENCES boards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            UNIQUE (name, "boardId"),
            PRIMARY KEY (id)
        );

        CREATE TABLE "boardMembers" (
            "memberId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "boardId" INTEGER REFERENCES boards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY ("memberId", "boardId")
        );

        CREATE TABLE cards (
            id SERIAL NOT NULL,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "coverUrl" VARCHAR(500),
            "listId" INTEGER REFERENCES lists(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id)
        );

        CREATE TABLE "cardComments" (
            text VARCHAR(4000) NOT NULL,
            "cardId" INTEGER REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "creatorId" INTEGER REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY ("creatorId", "cardId")
        );

        CREATE TABLE "cardAttachments" (
            id SERIAL NOT NULL,
            url VARCHAR(1000) NOT NULL,
            "cardId" INTEGER REFERENCES cards(id) ON DELETE CASCADE ON UPDATE CASCADE,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            PRIMARY KEY (id)
        );
    `);
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
}
