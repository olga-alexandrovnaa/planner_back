/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `ProductType` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProductType` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductType" DROP CONSTRAINT "ProductType_userId_fkey";

-- AlterTable
ALTER TABLE "ProductType" DROP COLUMN "isDeleted",
DROP COLUMN "userId";
