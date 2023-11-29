/*
  Warnings:

  - You are about to drop the column `eventTypeId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `EventType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "EventType" DROP CONSTRAINT "EventType_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_eventTypeId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "eventTypeId";

-- DropTable
DROP TABLE "EventType";
