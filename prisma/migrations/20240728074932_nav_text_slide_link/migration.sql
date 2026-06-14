-- AlterTable
ALTER TABLE "Slide" ADD COLUMN     "button" TEXT,
ADD COLUMN     "link" TEXT;

-- CreateTable
CREATE TABLE "NavText" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "show" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavText_pkey" PRIMARY KEY ("id")
);
