/*
  Warnings:

  - Added the required column `userId` to the `Cert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cert" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Cert" ADD CONSTRAINT "Cert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
