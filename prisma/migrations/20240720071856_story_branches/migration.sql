/*
  Warnings:

  - You are about to drop the column `branchId` on the `Story` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_branchId_fkey";

-- AlterTable
ALTER TABLE "Story" DROP COLUMN "branchId";

-- CreateTable
CREATE TABLE "StoryBranch" (
    "id" SERIAL NOT NULL,
    "storyId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryBranch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StoryBranch" ADD CONSTRAINT "StoryBranch_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryBranch" ADD CONSTRAINT "StoryBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
