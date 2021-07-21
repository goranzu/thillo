/*
  Warnings:

  - Made the column `url` on table `CardAttachment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "CardAttachment_cardId_unique";

-- AlterTable
ALTER TABLE "CardAttachment" ALTER COLUMN "url" SET NOT NULL;
