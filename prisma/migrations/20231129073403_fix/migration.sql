-- CreateTable
CREATE TABLE "EventType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCheck" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "note" TEXT,

    CONSTRAINT "EventCheck_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventCheck_eventId_date_key" ON "EventCheck"("eventId", "date");

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EventCheck" ADD CONSTRAINT "EventCheck_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "EventType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
