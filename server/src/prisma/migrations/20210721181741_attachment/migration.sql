/*
  Warnings:

  - A unique constraint covering the columns `[cardId]` on the table `CardAttachment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CardAttachment_cardId_unique" ON "CardAttachment"("cardId");
