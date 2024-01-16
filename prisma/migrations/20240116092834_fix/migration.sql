/*
  Warnings:

  - You are about to drop the column `recipe` on the `Food` table. All the data in the column will be lost.
  - You are about to drop the column `foodId` on the `Ingredient` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recipeStepId,productId]` on the table `Ingredient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recipeStepId` to the `Ingredient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_foodId_fkey";

-- DropIndex
DROP INDEX "Ingredient_foodId_productId_key";

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "recipe";

-- AlterTable
ALTER TABLE "Ingredient" DROP COLUMN "foodId",
ADD COLUMN     "recipeStepId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "RepeatDayTaskCheck" ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RepeatDayTaskWithNotYearInterval" ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RepeatDayTaskWithYearInterval" ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "hour" INTEGER NOT NULL DEFAULT 12,
ADD COLUMN     "minute" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "recipe" TEXT,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeStep_foodId_stepNumber_key" ON "RecipeStep"("foodId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_recipeStepId_productId_key" ON "Ingredient"("recipeStepId", "productId");

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_recipeStepId_fkey" FOREIGN KEY ("recipeStepId") REFERENCES "RecipeStep"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
