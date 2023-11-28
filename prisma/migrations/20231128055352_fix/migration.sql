-- CreateTable
CREATE TABLE "TaskBuyings" (
    "taskId" INTEGER NOT NULL,
    "buyingId" INTEGER NOT NULL,

    CONSTRAINT "TaskBuyings_pkey" PRIMARY KEY ("taskId","buyingId")
);

-- AddForeignKey
ALTER TABLE "TaskBuyings" ADD CONSTRAINT "TaskBuyings_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TaskBuyings" ADD CONSTRAINT "TaskBuyings_buyingId_fkey" FOREIGN KEY ("buyingId") REFERENCES "Buying"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
