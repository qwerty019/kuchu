/*
  Warnings:

  - You are about to drop the column `fbBranchId` on the `Branch` table. All the data in the column will be lost.
  - You are about to drop the column `Comment` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `CustomerName` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `CustomerPhone` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `DateLife` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `DocDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `DocId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `OrderSum` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `PaymentSum` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `PrepayDocId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `PrepaySum` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `Status` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `fbBranchId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `Country` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Discount` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Drug` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `DrugId` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Fabr` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `FabrBarcode` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `FirstNaklDataID` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `FixedPrice` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Form` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `FormId` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `InternalBarcode` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Mark` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `NDS` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Price` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `Quantity` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `SumDiscount` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `SumTax` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `SumWOTax` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `SumWTax` on the `OrderGood` table. All the data in the column will be lost.
  - You are about to drop the column `BarCode` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `commission` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `customDeclaration` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `distr` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `distrId` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `fabr` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `fbBranchId` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `firstNaklDataId` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `fixPriceValue` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `gtin` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `mark` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `pku` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `priceFabrNoNDS` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `priceOptWNDS` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `ratio` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `regId` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `ruDrugName` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `seria` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `sn` on the `Ost` table. All the data in the column will be lost.
  - You are about to drop the column `tovName` on the `Ost` table. All the data in the column will be lost.
  - Added the required column `fbId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderGood` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qnt` to the `OrderGood` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Good_regId_key";

-- AlterTable
ALTER TABLE "Branch" DROP COLUMN "fbBranchId",
ADD COLUMN     "fbId" INTEGER;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "Comment",
DROP COLUMN "CustomerName",
DROP COLUMN "CustomerPhone",
DROP COLUMN "DateLife",
DROP COLUMN "DocDate",
DROP COLUMN "DocId",
DROP COLUMN "OrderSum",
DROP COLUMN "PaymentSum",
DROP COLUMN "PrepayDocId",
DROP COLUMN "PrepaySum",
DROP COLUMN "Status",
DROP COLUMN "fbBranchId",
ADD COLUMN     "fbId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrderGood" DROP COLUMN "Country",
DROP COLUMN "Discount",
DROP COLUMN "Drug",
DROP COLUMN "DrugId",
DROP COLUMN "Fabr",
DROP COLUMN "FabrBarcode",
DROP COLUMN "FirstNaklDataID",
DROP COLUMN "FixedPrice",
DROP COLUMN "Form",
DROP COLUMN "FormId",
DROP COLUMN "InternalBarcode",
DROP COLUMN "Mark",
DROP COLUMN "NDS",
DROP COLUMN "Price",
DROP COLUMN "Quantity",
DROP COLUMN "SumDiscount",
DROP COLUMN "SumTax",
DROP COLUMN "SumWOTax",
DROP COLUMN "SumWTax",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "qnt" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Ost" DROP COLUMN "BarCode",
DROP COLUMN "commission",
DROP COLUMN "customDeclaration",
DROP COLUMN "distr",
DROP COLUMN "distrId",
DROP COLUMN "fabr",
DROP COLUMN "fbBranchId",
DROP COLUMN "firstNaklDataId",
DROP COLUMN "fixPriceValue",
DROP COLUMN "gtin",
DROP COLUMN "mark",
DROP COLUMN "pku",
DROP COLUMN "priceFabrNoNDS",
DROP COLUMN "priceOptWNDS",
DROP COLUMN "ratio",
DROP COLUMN "regId",
DROP COLUMN "ruDrugName",
DROP COLUMN "seria",
DROP COLUMN "sn",
DROP COLUMN "tovName";
