-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roles" TEXT[];

-- CreateTable
CREATE TABLE "Branch" (
    "id" SERIAL NOT NULL,
    "cityId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT,
    "fbBranchId" INTEGER,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Good" (
    "id" SERIAL NOT NULL,
    "subCategoryId" INTEGER,
    "regId" INTEGER NOT NULL,
    "drugId" INTEGER NOT NULL,
    "formId" INTEGER NOT NULL,
    "fabrId" INTEGER NOT NULL,
    "mnnId" INTEGER NOT NULL,
    "drug" TEXT NOT NULL,
    "form" TEXT NOT NULL,
    "fabr" TEXT NOT NULL,
    "mnn" TEXT NOT NULL,
    "flag" INTEGER NOT NULL,
    "ean" TEXT NOT NULL,
    "isVital" BOOLEAN NOT NULL,
    "isService" BOOLEAN NOT NULL,
    "rSum" DOUBLE PRECISION NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Good_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Good" ADD CONSTRAINT "Good_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
