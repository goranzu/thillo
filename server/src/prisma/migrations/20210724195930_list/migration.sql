/*
  Warnings:

  - A unique constraint covering the columns `[id,boardId]` on the table `List` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "List.id_boardId_unique" ON "List"("id", "boardId");
