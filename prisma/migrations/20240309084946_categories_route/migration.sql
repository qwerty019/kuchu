/*
  Warnings:

  - Added the required column `route` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `route` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "route" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "route" TEXT NOT NULL;
