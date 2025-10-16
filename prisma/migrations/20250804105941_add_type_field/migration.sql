/*
  Warnings:

  - Added the required column `type` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Recipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "type" TEXT NOT NULL;
