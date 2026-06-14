/*
  Warnings:

  - Added the required column `Country` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Discount` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Drug` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DrugId` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Fabr` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FabrBarcode` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FirstNaklDataID` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FixedPrice` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Form` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FormId` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `InternalBarcode` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Mark` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NDS` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Price` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Quantity` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SumDiscount` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SumTax` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SumWOTax` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SumWTax` to the `OrderGood` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderGood" ADD COLUMN     "Country" TEXT NOT NULL,
ADD COLUMN     "Discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Drug" TEXT NOT NULL,
ADD COLUMN     "DrugId" INTEGER NOT NULL,
ADD COLUMN     "Fabr" TEXT NOT NULL,
ADD COLUMN     "FabrBarcode" TEXT NOT NULL,
ADD COLUMN     "FirstNaklDataID" INTEGER NOT NULL,
ADD COLUMN     "FixedPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Form" TEXT NOT NULL,
ADD COLUMN     "FormId" INTEGER NOT NULL,
ADD COLUMN     "InternalBarcode" TEXT NOT NULL,
ADD COLUMN     "Mark" BOOLEAN NOT NULL,
ADD COLUMN     "NDS" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "Quantity" INTEGER NOT NULL,
ADD COLUMN     "SumDiscount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "SumTax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "SumWOTax" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "SumWTax" DOUBLE PRECISION NOT NULL;
