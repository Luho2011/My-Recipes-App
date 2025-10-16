/*
  Warnings:

  - Added the required column `originalId` to the `UserRecipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserRecipes" ADD COLUMN     "originalId" TEXT NOT NULL;
