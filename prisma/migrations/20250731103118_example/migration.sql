-- AlterTable
ALTER TABLE "Myrecipes" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'leicht',
ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '30min';

-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "difficulty" TEXT NOT NULL DEFAULT 'leicht',
ADD COLUMN     "duration" TEXT NOT NULL DEFAULT '30min';
