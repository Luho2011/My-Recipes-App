/*
  Warnings:

  - Added the required column `genre` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `genre` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "genre" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "genre" TEXT NOT NULL;
