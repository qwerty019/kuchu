/*
  Warnings:

  - Made the column `route` on table `City` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "City" ALTER COLUMN "route" SET NOT NULL;
