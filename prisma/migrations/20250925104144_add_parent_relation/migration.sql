-- AlterTable
ALTER TABLE "Recipes" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "Recipes" ADD CONSTRAINT "Recipes_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Recipes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
