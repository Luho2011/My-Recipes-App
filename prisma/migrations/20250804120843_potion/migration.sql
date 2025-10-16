/*
  Warnings:

  - Added the required column `potion` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `potion` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "potion" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "potion" TEXT NOT NULL;
