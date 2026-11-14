import React, { cache } from 'react'
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import RecipesCard from '@/components/RecipesCard';
import NavBar from '@/components/NavBar';

// liest den slug aus (params)
type Params = {
  slug: string;
};

// cache(): generateMetadata und Page rufen getRecipe mit demselben slug auf,
// die DB wird pro Request aber nur einmal abgefragt.
const getRecipe = cache(async (slug: string) => {
  return prisma.recipes.findUnique({ where: { slug } });
});

// ISR: Seite wird statisch erzeugt und spätestens nach 1 h neu validiert
export const revalidate = 3600;

// Alle vorhandenen Rezepte beim Build vorrendern (SSG)
export async function generateStaticParams() {
  const recipes = await prisma.recipes.findMany({ select: { slug: true } });
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<Params> }
): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await getRecipe(slug);

  if (!recipe) {
    return { title: 'Rezept nicht gefunden', robots: { index: false } };
  }

  // Zeilenumbrüche/Mehrfach-Leerzeichen zusammenfassen und auf ~155 Zeichen kürzen
  const text = recipe.description.replace(/\s+/g, ' ').trim();
  const description = text.length > 155 ? `${text.slice(0, 154).trimEnd()}…` : text;
  const url = `/recipesdetails/${slug}`;

  return {
    title: recipe.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: recipe.title,
      description,
      url,
      type: 'article',
      images: [recipe.image || '/yoshi.png'],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // Promise auflösen (Next.js 15 verlangt das)

  const recipe = await getRecipe(resolvedParams.slug);

    if (!recipe) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-semibold">Rezept nicht gefunden</h1>
      </div>
    );
  }

    const recipeForCard = {
    // spread operator kopiert alle eigenschaften von recipe (id, title, duration, potion...)  
    ...recipe,
    image: recipe.image || null,
    duration: recipe.duration.toString(),
    potion: recipe.potion.toString(),
  };

  return (
    <div className='flex flex-col items-center relative'>
      <div className='bg-[#FF6048] top-0 w-full mb-5 h-[275px] md:h-[50px]'>
        < NavBar showSearch={false} showGenre={false}/>
      </div>
      <div className='w-full absolute top-15'>
         <RecipesCard recipe={recipeForCard} variant="detail"/>
      </div>
    </div>
  )
}

