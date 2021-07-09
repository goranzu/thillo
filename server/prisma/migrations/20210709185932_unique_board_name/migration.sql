/*
  Warnings:

  - A unique constraint covering the columns `[name,creatorId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board.name_creatorId_unique" ON "Board"("name", "creatorId");
