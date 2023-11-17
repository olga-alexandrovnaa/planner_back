/*
  Warnings:

  - You are about to drop the column `trackerId` on the `Ingredient` table. All the data in the column will be lost.
  - You are about to drop the column `foodType` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `otherFoodId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `recipe` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[foodId,productId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `foodId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_trackerId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_otherFoodId_fkey";

-- DropIndex
DROP INDEX "Ingredient_trackerId_productId_key";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "trackerId",
ADD COLUMN     "foodId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "foodType",
DROP COLUMN "otherFoodId",
DROP COLUMN "recipe",
ADD COLUMN     "foodId" INTEGER,
ALTER COLUMN "name" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "foodType" "FoodType",
    "recipe" TEXT,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_foodId_productId_key" ON "Ingredient"("foodId", "productId");

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
