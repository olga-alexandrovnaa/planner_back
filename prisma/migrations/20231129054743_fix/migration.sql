/*
  Warnings:

  - You are about to drop the `Holiday` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Holiday" DROP CONSTRAINT "Holiday_userId_fkey";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "isHoliday" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "Holiday";
