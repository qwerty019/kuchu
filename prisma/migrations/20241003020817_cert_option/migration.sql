-- CreateTable
CREATE TABLE "CertOption" (
    "id" SERIAL NOT NULL,
    "nominal" INTEGER NOT NULL,
    "url" TEXT,
    "title" TEXT,
    "show" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CertOption_pkey" PRIMARY KEY ("id")
);
