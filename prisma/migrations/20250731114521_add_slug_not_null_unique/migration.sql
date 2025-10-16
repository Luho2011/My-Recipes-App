/*
  Warnings:

  - Made the column `slug` on table `Myrecipes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `slug` on table `Recipes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ALTER COLUMN "slug" SET NOT NULL;

-- AlterTable
ALTER TABLE "Recipes" ALTER COLUMN "slug" SET NOT NULL;
