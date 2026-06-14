-- CreateTable
CREATE TABLE "UserGood" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goodId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGood_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserGood" ADD CONSTRAINT "UserGood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGood" ADD CONSTRAINT "UserGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
