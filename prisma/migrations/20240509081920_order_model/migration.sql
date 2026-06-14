/*
  Warnings:

  - Added the required column `allSum` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "allSum" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "paymentType" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL;
