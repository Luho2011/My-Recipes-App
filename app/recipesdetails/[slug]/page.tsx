import React from 'react'
import { prisma } from '@/lib/prisma';
import RecipesCard from '@/components/RecipesCard';
import NavBar from '@/components/NavBar';

// liest den slug aus (params)
type Params = {
  slug: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const resolvedParams = await params; // Promise auflösen (Next.js 15 verlangt das)

  const recipe = await prisma.recipes.findUnique({
    where: {
      slug: resolvedParams.slug,
    },
  });

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

