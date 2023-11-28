/*
  Warnings:

  - The primary key for the `DayNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `DayNote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DayNote" DROP CONSTRAINT "DayNote_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "DayNote_pkey" PRIMARY KEY ("userId", "date");
