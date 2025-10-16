/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Myrecipes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Recipes` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Myrecipes_slug_key" ON "Myrecipes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Recipes_slug_key" ON "Recipes"("slug");
