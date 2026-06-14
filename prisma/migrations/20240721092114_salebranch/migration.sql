-- CreateTable
CREATE TABLE "SaleBranch" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SaleBranch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SaleBranch" ADD CONSTRAINT "SaleBranch_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleBranch" ADD CONSTRAINT "SaleBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
