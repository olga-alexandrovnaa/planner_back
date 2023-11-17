-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "otherFoodId" INTEGER;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_otherFoodId_fkey" FOREIGN KEY ("otherFoodId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
