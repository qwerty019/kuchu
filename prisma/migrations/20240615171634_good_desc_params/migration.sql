/*
  Warnings:

  - You are about to drop the column `hran` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `srokG` on the `Good` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Good" DROP COLUMN "hran",
DROP COLUMN "srokG",
ADD COLUMN     "child" TEXT,
ADD COLUMN     "cinetics" TEXT,
ADD COLUMN     "compound" TEXT,
ADD COLUMN     "contra" TEXT,
ADD COLUMN     "desc" TEXT,
ADD COLUMN     "dispense" TEXT,
ADD COLUMN     "drive" TEXT,
ADD COLUMN     "form2" TEXT,
ADD COLUMN     "img" TEXT,
ADD COLUMN     "indications" TEXT,
ADD COLUMN     "inter" TEXT,
ADD COLUMN     "org" TEXT,
ADD COLUMN     "overdose" TEXT,
ADD COLUMN     "pharm" TEXT,
ADD COLUMN     "pregnancy" TEXT,
ADD COLUMN     "release" TEXT,
ADD COLUMN     "side" TEXT,
ADD COLUMN     "special" TEXT,
ADD COLUMN     "srok" TEXT,
ADD COLUMN     "storage" TEXT,
ADD COLUMN     "usage" TEXT;
