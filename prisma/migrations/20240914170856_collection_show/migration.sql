/*
  Warnings:

  - You are about to drop the column `show` on the `CollGood` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CollGood" DROP COLUMN "show";

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "show" BOOLEAN NOT NULL DEFAULT false;
