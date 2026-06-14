/*
  Warnings:

  - You are about to drop the column `action` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `child` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `cinetics` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `compound` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `contra` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `desc` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `dispense` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `dosage` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `drive` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `indications` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `inter` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `org` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `overdose` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `pharm` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `pregnancy` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `release` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `side` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `special` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `srok` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `storage` on the `Good` table. All the data in the column will be lost.
  - You are about to drop the column `usage` on the `Good` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Good" DROP COLUMN "action",
DROP COLUMN "child",
DROP COLUMN "cinetics",
DROP COLUMN "compound",
DROP COLUMN "contra",
DROP COLUMN "desc",
DROP COLUMN "dispense",
DROP COLUMN "dosage",
DROP COLUMN "drive",
DROP COLUMN "indications",
DROP COLUMN "inter",
DROP COLUMN "org",
DROP COLUMN "overdose",
DROP COLUMN "pharm",
DROP COLUMN "pregnancy",
DROP COLUMN "release",
DROP COLUMN "side",
DROP COLUMN "special",
DROP COLUMN "srok",
DROP COLUMN "storage",
DROP COLUMN "usage";
