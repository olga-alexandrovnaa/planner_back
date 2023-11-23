/*
  Warnings:

  - The primary key for the `OutcomeMeasureUnit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[parentId,measureUnitId]` on the table `OutcomeMeasureUnit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `OutcomeMeasureUnit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OutcomeMeasureUnit" DROP CONSTRAINT "OutcomeMeasureUnit_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "parentId" INTEGER NOT NULL,
ADD CONSTRAINT "OutcomeMeasureUnit_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "OutcomeMeasureUnit_parentId_measureUnitId_key" ON "OutcomeMeasureUnit"("parentId", "measureUnitId");

-- AddForeignKey
ALTER TABLE "OutcomeMeasureUnit" ADD CONSTRAINT "OutcomeMeasureUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
