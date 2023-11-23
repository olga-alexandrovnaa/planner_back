-- DropForeignKey
ALTER TABLE "Ingredient" DROP CONSTRAINT "Ingredient_measureUnitId_fkey";

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_measureUnitId_fkey" FOREIGN KEY ("measureUnitId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
