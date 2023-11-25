-- CreateEnum
CREATE TYPE "IntervalType" AS ENUM ('Day', 'Week', 'Month', 'Year');

-- CreateEnum
CREATE TYPE "MoveTypeIfDayNotExists" AS ENUM ('nextIntervalFirstDay', 'currentIntervalLastDay');

-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('breakfast', 'soup', 'second', 'dessert', 'salad', 'drink', 'snack');

-- CreateEnum
CREATE TYPE "WeekNumber" AS ENUM ('first', 'second', 'third', 'last');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Password" (
    "id" SERIAL NOT NULL,
    "hash" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Password_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "refreshToken" VARCHAR NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "date" TEXT NOT NULL,
    "isTracker" BOOLEAN NOT NULL DEFAULT false,
    "intervalPart" "IntervalType",
    "intervalLength" INTEGER,
    "repeatCount" INTEGER,
    "moneyIncomePlan" DOUBLE PRECISION,
    "moneyOutcomePlan" DOUBLE PRECISION,
    "name" TEXT,
    "isFood" BOOLEAN NOT NULL DEFAULT false,
    "foodId" INTEGER,
    "foodCountToPrepare" DOUBLE PRECISION,
    "foodCout" DOUBLE PRECISION,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "proteins" DOUBLE PRECISION,
    "fats" DOUBLE PRECISION,
    "carbohydrates" DOUBLE PRECISION,
    "calories" DOUBLE PRECISION,
    "foodType" "FoodType",
    "recipe" TEXT,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthMoneyInfo" (
    "date" TEXT NOT NULL,
    "remainder" DOUBLE PRECISION NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "MonthMoneyInfo_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "InvestmentType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "InvestmentType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentMonthProgress" (
    "date" TEXT NOT NULL,
    "investmentTypeId" INTEGER NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "InvestmentMonthProgress_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "RepeatDayTaskCheck" (
    "id" SERIAL NOT NULL,
    "trackerId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "newDate" TEXT,
    "checked" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "moneyIncomeFact" DOUBLE PRECISION,
    "moneyOutcomeFact" DOUBLE PRECISION,
    "deadline" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "RepeatDayTaskCheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepeatDayTaskWithNotYearInterval" (
    "id" SERIAL NOT NULL,
    "trackerId" INTEGER NOT NULL,
    "intervalPartIndex" INTEGER,
    "dayFromBeginningInterval" INTEGER,
    "weekNumber" "WeekNumber",
    "weekDayNumber" INTEGER,
    "moveTypeIfDayNotExists" "MoveTypeIfDayNotExists",

    CONSTRAINT "RepeatDayTaskWithNotYearInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepeatDayTaskWithYearInterval" (
    "id" SERIAL NOT NULL,
    "trackerId" INTEGER NOT NULL,
    "intervalPartIndex" INTEGER NOT NULL,
    "yearDateDay" INTEGER NOT NULL,
    "yearDateMonth" INTEGER NOT NULL,
    "moveTypeIfDayNotExists" "MoveTypeIfDayNotExists",

    CONSTRAINT "RepeatDayTaskWithYearInterval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasureUnit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MeasureUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeId" INTEGER,
    "measureUnitId" INTEGER NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutcomeMeasureUnit" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "measureUnitId" INTEGER NOT NULL,
    "outcomeOfProduct" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OutcomeMeasureUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" SERIAL NOT NULL,
    "foodId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "count" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "measureUnitId" INTEGER,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buying" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "checked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Buying_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DayNote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DayNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Holiday" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT,
    "weekNumber" "WeekNumber",
    "weekDayNumber" INTEGER,
    "moveTypeIfDayNotExists" "MoveTypeIfDayNotExists",
    "text" TEXT NOT NULL,

    CONSTRAINT "Holiday_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "RepeatDayTaskCheck_trackerId_date_key" ON "RepeatDayTaskCheck"("trackerId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "OutcomeMeasureUnit_parentId_measureUnitId_key" ON "OutcomeMeasureUnit"("parentId", "measureUnitId");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_foodId_productId_key" ON "Ingredient"("foodId", "productId");

-- AddForeignKey
ALTER TABLE "Password" ADD CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "MonthMoneyInfo" ADD CONSTRAINT "MonthMoneyInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InvestmentType" ADD CONSTRAINT "InvestmentType_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InvestmentMonthProgress" ADD CONSTRAINT "InvestmentMonthProgress_investmentTypeId_fkey" FOREIGN KEY ("investmentTypeId") REFERENCES "InvestmentType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "InvestmentMonthProgress" ADD CONSTRAINT "InvestmentMonthProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RepeatDayTaskCheck" ADD CONSTRAINT "RepeatDayTaskCheck_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RepeatDayTaskWithNotYearInterval" ADD CONSTRAINT "RepeatDayTaskWithNotYearInterval_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "RepeatDayTaskWithYearInterval" ADD CONSTRAINT "RepeatDayTaskWithYearInterval_trackerId_fkey" FOREIGN KEY ("trackerId") REFERENCES "Task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "ProductType"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_measureUnitId_fkey" FOREIGN KEY ("measureUnitId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OutcomeMeasureUnit" ADD CONSTRAINT "OutcomeMeasureUnit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "OutcomeMeasureUnit" ADD CONSTRAINT "OutcomeMeasureUnit_measureUnitId_fkey" FOREIGN KEY ("measureUnitId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Ingredient" ADD CONSTRAINT "Ingredient_measureUnitId_fkey" FOREIGN KEY ("measureUnitId") REFERENCES "MeasureUnit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Buying" ADD CONSTRAINT "Buying_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DayNote" ADD CONSTRAINT "DayNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Holiday" ADD CONSTRAINT "Holiday_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
