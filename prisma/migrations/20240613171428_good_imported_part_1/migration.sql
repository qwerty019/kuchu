-- AlterTable
ALTER TABLE "Good" ADD COLUMN     "formoutput" TEXT,
ADD COLUMN     "hran" TEXT,
ADD COLUMN     "imported" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "jvls" INTEGER,
ADD COLUMN     "recept" INTEGER,
ADD COLUMN     "srokG" TEXT,
ADD COLUMN     "torgname" TEXT;
