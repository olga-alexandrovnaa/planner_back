/*
  Warnings:

  - You are about to drop the column `outcomeTypeId` on the `Buying` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buying" DROP CONSTRAINT "Buying_outcomeTypeId_fkey";

-- AlterTable
ALTER TABLE "Buying" DROP COLUMN "outcomeTypeId";

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "incomeTypeId" INTEGER,
ADD COLUMN     "outcomeTypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_outcomeTypeId_fkey" FOREIGN KEY ("outcomeTypeId") REFERENCES "OutcomeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_incomeTypeId_fkey" FOREIGN KEY ("incomeTypeId") REFERENCES "IncomeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
