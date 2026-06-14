/*
  Warnings:

  - You are about to drop the column `amount` on the `DiscountCard` table. All the data in the column will be lost.
  - You are about to drop the column `cardNumber` on the `DiscountCard` table. All the data in the column will be lost.
  - Added the required column `accumulation` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `barcode` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountJ` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateAccumulation` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rateAccumulationJ` to the `DiscountCard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DiscountCard" DROP COLUMN "amount",
DROP COLUMN "cardNumber",
ADD COLUMN     "accumulation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "barcode" TEXT NOT NULL,
ADD COLUMN     "discount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "discountJ" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rateAccumulation" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rateAccumulationJ" DOUBLE PRECISION NOT NULL;
