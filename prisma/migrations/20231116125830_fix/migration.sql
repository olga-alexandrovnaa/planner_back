-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('breakfast', 'soup', 'second', 'dessert', 'salad', 'drink', 'snack');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "foodType" "FoodType";
