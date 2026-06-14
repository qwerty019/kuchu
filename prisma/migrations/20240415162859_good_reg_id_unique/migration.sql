/*
  Warnings:

  - A unique constraint covering the columns `[regId]` on the table `Good` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Good_regId_key" ON "Good"("regId");
