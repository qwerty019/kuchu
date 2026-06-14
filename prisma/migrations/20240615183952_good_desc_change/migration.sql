/*
  Warnings:

  - You are about to drop the column `form2` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `jvls` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `recept` on the `Good` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Good" DROP COLUMN "form2",
DROP COLUMN "jvls",
DROP COLUMN "recept",
ADD COLUMN     "action" TEXT,
ADD COLUMN     "dosage" TEXT;
