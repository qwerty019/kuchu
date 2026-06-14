/*
  Warnings:

  - Added the required column `Comment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CustomerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `CustomerPhone` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DateLife` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DocDate` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DocId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `OrderSum` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PaymentSum` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PrepayDocId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `PrepaySum` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "Comment" TEXT NOT NULL,
ADD COLUMN     "CustomerName" TEXT NOT NULL,
ADD COLUMN     "CustomerPhone" TEXT NOT NULL,
ADD COLUMN     "DateLife" TEXT NOT NULL,
ADD COLUMN     "DocDate" TEXT NOT NULL,
ADD COLUMN     "DocId" INTEGER NOT NULL,
ADD COLUMN     "OrderSum" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "PaymentSum" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "PrepayDocId" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "PrepaySum" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Status" INTEGER NOT NULL,
ADD COLUMN     "branchId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Address" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "entrance" TEXT,
    "floor" TEXT,
    "apartment" TEXT,
    "comment" TEXT,
    "selected" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderGood" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "goodId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderGood_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ost" (
    "id" SERIAL NOT NULL,
    "goodId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "fbBranchId" INTEGER NOT NULL,
    "regId" INTEGER NOT NULL,
    "tovName" TEXT NOT NULL,
    "fabr" TEXT NOT NULL,
    "ruDrugName" TEXT NOT NULL,
    "naklDataId" INTEGER NOT NULL,
    "uQntOst" INTEGER NOT NULL,
    "priceRoznWNDS" DOUBLE PRECISION NOT NULL,
    "priceOptWNDS" INTEGER NOT NULL,
    "priceFabrNoNDS" INTEGER NOT NULL,
    "jv" BOOLEAN NOT NULL,
    "brakLS" BOOLEAN NOT NULL,
    "isAptekaRu" BOOLEAN NOT NULL,
    "BarCode" TEXT NOT NULL,
    "fixPriceValue" INTEGER NOT NULL,
    "pku" TEXT NOT NULL,
    "isPersonalOrder" BOOLEAN NOT NULL,
    "recipe" BOOLEAN NOT NULL,
    "uQntRez" INTEGER NOT NULL,
    "nds" INTEGER NOT NULL,
    "srokG" TEXT NOT NULL,
    "ratio" INTEGER NOT NULL,
    "mark" BOOLEAN NOT NULL,
    "firstNaklDataId" INTEGER NOT NULL,
    "distrId" INTEGER NOT NULL,
    "distr" TEXT NOT NULL,
    "customDeclaration" TEXT NOT NULL,
    "seria" TEXT NOT NULL,
    "sn" TEXT NOT NULL,
    "gtin" TEXT NOT NULL,
    "commission" BOOLEAN NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderGood" ADD CONSTRAINT "OrderGood_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderGood" ADD CONSTRAINT "OrderGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ost" ADD CONSTRAINT "Ost_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ost" ADD CONSTRAINT "Ost_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
