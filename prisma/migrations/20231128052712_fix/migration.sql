/*
  Warnings:

  - You are about to drop the column `name` on the `DayNote` table. All the data in the column will be lost.
  - Added the required column `outcomeTypeId` to the `Buying` table without a default value. This is not possible if the table is not empty.
  - Added the required column `note` to the `DayNote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Buying" ADD COLUMN     "outcomeTypeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "DayNote" DROP COLUMN "name",
ADD COLUMN     "note" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "IncomeType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "IncomeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OutcomeType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncomeType" ADD CONSTRAINT "IncomeType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OutcomeType" ADD CONSTRAINT "OutcomeType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Buying" ADD CONSTRAINT "Buying_outcomeTypeId_fkey" FOREIGN KEY ("outcomeTypeId") REFERENCES "OutcomeType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
