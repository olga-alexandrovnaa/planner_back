-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
