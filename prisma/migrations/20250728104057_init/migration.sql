/*
  Warnings:

  - Added the required column `ingredients` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "ingredients" TEXT NOT NULL;
