import React from 'react';
import { prisma } from '@/lib/prisma';
import RecipesCard from "@/components/RecipesCard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import NavBar from '@/components/NavBar';
import SearchBar from '@/components/SearchBar';

type SearchParams = {
  q?: string;
  genre?: string;
  duration?: string;
};

export default async function MyRecipes({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams; // ✅ Promise auflösen (Pflicht ab Next 15)
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">
          Bitte einloggen, um deine Favoriten zu sehen
        </h1>
        <a
          href="/login"
          className="bg-green-600 hover:bg-green-400 text-white px-4 py-2 rounded-md"
        >
          Zum Login
        </a>
      </div>
    );
  }

  const query = params.q || '';
  const genre = params.genre || '';
  const duration = params.duration ? parseInt(params.duration, 10) : null;

  // Favoriten des Users
  const myRecipes = await prisma.myrecipes.findMany({
    where: { userId: session.user.id },
    include: { recipe: true },
  });

  // Filter nach Query und Genres (nur in Favoriten)
  const filtered = myRecipes.filter((fav) => {
    const recipe = fav.recipe;
    const matchesQuery = query
      ? recipe.title.toLowerCase().includes(query.toLowerCase())
      : true;
    const matchesDuration = duration ? recipe.duration <= duration : true;
    const matchesGenre = genre ? recipe.genre === genre : true;
    return matchesQuery && matchesDuration && matchesGenre;
  });

  return (
    <div className="flex flex-col items-center gap-6">
      <NavBar showSearch={false} context="favorites" />
      <div className="w-2/3 md:h-22 md:px-6 md:mb-10 md:mt-10 flex items-center bg-[#EED5C8] rounded-[12px]">
        <SearchBar context="favorites" currentGenre={genre} userId={session.user.id} />
      </div> 
      <h1 className="text-3xl">Meine Favoriten</h1>
      <div className="flex flex-wrap gap-5 justify-center mb-5">
      {filtered.map(fav => (
        <RecipesCard
          key={fav.recipe.id}
          recipe={{
            ...fav.recipe,
            duration: fav.recipe.duration.toString(),
            potion: fav.recipe.potion.toString(),
            image: fav.recipe.image || null,
          }}
          showDelete
        />
      ))}
      </div>
    </div>
  );
}


