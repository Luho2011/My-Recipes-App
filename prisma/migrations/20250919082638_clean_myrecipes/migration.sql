/*
  Warnings:

  - You are about to drop the column `description` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `genre` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `ingredients` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `potion` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Myrecipes` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Myrecipes` table. All the data in the column will be lost.
  - Added the required column `recipeId` to the `Myrecipes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Myrecipes" DROP COLUMN "description",
DROP COLUMN "difficulty",
DROP COLUMN "duration",
DROP COLUMN "genre",
DROP COLUMN "image",
DROP COLUMN "ingredients",
DROP COLUMN "potion",
DROP COLUMN "slug",
DROP COLUMN "title",
DROP COLUMN "type",
ADD COLUMN     "recipeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Myrecipes" ADD CONSTRAINT "Myrecipes_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
