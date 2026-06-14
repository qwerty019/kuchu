/*
  Warnings:

  - You are about to drop the column `branchId` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "long" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "branchId",
ADD COLUMN     "addressId" INTEGER,
ADD COLUMN     "deliveryFee" DOUBLE PRECISION,
ADD COLUMN     "fbBranchId" INTEGER;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address"("id") ON DELETE SET NULL ON UPDATE CASCADE;
