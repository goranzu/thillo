/*
  Warnings:

  - A unique constraint covering the columns `[id,creatorId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board.id_creatorId_unique" ON "Board"("id", "creatorId");
