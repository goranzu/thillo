/* eslint-disable @typescript-eslint/naming-convention */
import { MigrationBuilder } from "node-pg-migrate";

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
        CREATE TABLE users (
            id SERIAL NOT NULL,
            "firstName" VARCHAR(254) NOT NULL,
            "lastName" VARCHAR(254) NOT NULL,
            email VARCHAR(254) NOT NULL,
            password VARCHAR(500) NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT users_id_pkey PRIMARY KEY (id),
            CONSTRAINT users_email_key UNIQUE (email)
        );

        CREATE TABLE boards (
            id SERIAL NOT NULL,
            name VARCHAR(100) NOT NULL,
            "isPrivate" BOOLEAN NOT NULL DEFAULT false,
            description VARCHAR(1000),
            "creatorId" INTEGER NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "boards_name_creatorId_key" UNIQUE (name, "creatorId"),
            CONSTRAINT boards_id_pkey PRIMARY KEY (id),
            CONSTRAINT "boards_creatorId_fkey" FOREIGN KEY ("creatorId")
                        REFERENCES users (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE lists (
            id SERIAL NOT NULL,
            name VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "creatorId" INTEGER NOT NULL,
            "boardId" INTEGER NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "lists_name_boardId_key" UNIQUE (name, "boardId"),
            CONSTRAINT lists_id_pkey PRIMARY KEY (id),
            CONSTRAINT "lists_creatorId_fkey" FOREIGN KEY ("creatorId")
                        REFERENCES users (id)
                        ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "lists_boardId_fkey" FOREIGN KEY ("boardId")
                        REFERENCES boards (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE "boardMembers" (
            "memberId" INTEGER NOT NULL,
            "boardId" INTEGER NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "boardMembers_memberId_boardId_pkey" PRIMARY KEY ("memberId", "boardId"),
            CONSTRAINT "boardMembers_boardId_fkey" FOREIGN KEY ("boardId")
                        REFERENCES boards (id)
                        ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT  "boardMembers_memberId_fkey" FOREIGN KEY ("memberId")
                        REFERENCES users (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE cards (
            id SERIAL NOT NULL,
            title VARCHAR(100) NOT NULL,
            description VARCHAR(1000),
            "coverUrl" VARCHAR(500),
            "listId" INTEGER NOT NULL,
            "creatorId" INTEGER NOT NULL,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT cards_id_pkey PRIMARY KEY (id),
            CONSTRAINT "cards_listId_fkey" FOREIGN KEY ("listId")
                        REFERENCES lists (id)
                        ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "cards_creatorId_fkey" FOREIGN KEY ("creatorId")
                        REFERENCES users (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE "cardComments" (
            text VARCHAR(4000) NOT NULL,
            "cardId" INTEGER,
            "creatorId" INTEGER,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "cardComments_creatorId_cardId_pkey" PRIMARY KEY ("creatorId", "cardId"),
            CONSTRAINT "cardComments_cardId_fkey" FOREIGN KEY ("cardId")
                        REFERENCES cards (id)
                        ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "cardComments_creatorId_fkey" FOREIGN KEY ("creatorId")
                        REFERENCES users (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
        );

        CREATE TABLE "cardAttachments" (
            id SERIAL NOT NULL,
            url VARCHAR(1000) NOT NULL,
            "cardId" INTEGER,
            "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT "cardAttachments_id_pkey" PRIMARY KEY (id),
            CONSTRAINT "cardAttachments_cardId_fkey" FOREIGN KEY ("cardId")
                        REFERENCES cards (id)
                        ON DELETE CASCADE ON UPDATE CASCADE
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
