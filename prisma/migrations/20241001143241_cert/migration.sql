-- CreateTable
CREATE TABLE "Cert" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "expDate" DATE NOT NULL,
    "email" TEXT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertBranch" (
    "id" SERIAL NOT NULL,
    "certId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertBranch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertPayment" (
    "id" SERIAL NOT NULL,
    "certId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT,
    "ykId" TEXT,
    "url" TEXT,
    "token" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertPayment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CertBranch" ADD CONSTRAINT "CertBranch_certId_fkey" FOREIGN KEY ("certId") REFERENCES "Cert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertBranch" ADD CONSTRAINT "CertBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertPayment" ADD CONSTRAINT "CertPayment_certId_fkey" FOREIGN KEY ("certId") REFERENCES "Cert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
