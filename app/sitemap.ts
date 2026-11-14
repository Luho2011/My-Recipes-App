import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';

// Bei jedem Request neu erzeugen, damit neue Rezepte sofort drin sind
// (und der Build keine DB-Verbindung braucht).
export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // gleiche Filterlogik wie die Startseite: nur Original-Rezepte, keine Kopien/Varianten
  const recipes = await prisma.recipes.findMany({
    where: { parentId: null },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    ...recipes.map((recipe) => ({
      url: `${SITE_URL}/recipesdetails/${recipe.slug}`,
      lastModified: recipe.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
