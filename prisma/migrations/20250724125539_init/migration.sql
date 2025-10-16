/*
  Warnings:

  - Added the required column `description` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "description" TEXT NOT NULL;
