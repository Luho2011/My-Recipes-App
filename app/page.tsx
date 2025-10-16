import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import RecipesCard from "@/components/RecipesCard";
import Link from "next/link";
import SearchBar from '@/components/SearchBar';


const PAGE_SIZE = 4;

export default async function Home({ searchParams } : { searchParams: { q?: string; genre?: string; duration?: string; page?: string}}) {
  const session = await getServerSession(authOptions);

  const query = searchParams.q || '';
  const genre = searchParams.genre || '';
  const duration = searchParams.duration ? parseInt(searchParams.duration, 10) : null;
  const page = parseInt(searchParams.page || "1", 10);

const where: Prisma.RecipesWhereInput = {
  AND: [
    query ? { title: { contains: query, mode: "insensitive" } } : {},
    genre ? { genre: { equals: genre, mode: "insensitive" } } : {},
    duration ? { duration: { lte: duration } } : {},
  ],
};

  // Original-Rezepte
  const recipes = await prisma.recipes.findMany({
    where: { ...where, parentId: null },
    take: PAGE_SIZE * page,
    orderBy: { createdAt: "desc" },
  });
  const total = await prisma.recipes.count({ where });
  const hasMore = total > PAGE_SIZE * page;

  const pastaRecipes = await prisma.recipes.findMany({
    where: { genre: "Nudelgerichte", parentId: null },
    take: 4, // z. B. nur 6 anzeigen
    orderBy: { createdAt: "desc" },
  });

  const soupRecipes = await prisma.recipes.findMany({
    where: { genre: "Suppen", parentId: null },
    take: 4, // z. B. nur 6 anzeigen
    orderBy: { createdAt: "desc" },
  });

  const asiaRecipes = await prisma.recipes.findMany({
    where: { genre: "Asiatisch", parentId: null },
    take: 4, // z. B. nur 6 anzeigen
    orderBy: { createdAt: "desc" },
  });

  // Favoriten
  const favs = session
    ? await prisma.myrecipes.findMany({
        where: { userId: session.user.id },
        include: { recipe: { select: { slug: true } } },
      })
    : [];
  const favorites = favs.map(f => f.recipe.slug);

// User-Rezepte (Kopien)
const userRecipes = session
  ? await prisma.userRecipes.findMany({
      where: { userId: session.user.id },
      select: { recipeId: true, originalId: true },
    })
  : [];

// IDs der Original-Rezepte, die der User bereits hinzugefügt hat
const addedOriginalIds = userRecipes.map(ur => ur.originalId);

const isFiltered = !!genre || !!query || !!duration || page > 1;

  return (
    <div className="flex flex-col items-center gap-6">
      <NavBar showSearch={false}/>
     <div className='w-2/3 md:h-22 md:px-6 md:mb-10 md:mt-10 flex items-center bg-[#EED5C8] rounded-[12px]'>
       <SearchBar context="home" currentGenre={genre}/>
     </div> 

      <div className='flex flex-col'>
        {!isFiltered && <h1 className='text-3xl mb-4 [@media(max-width:1472px)]:text-center'>Neuste Rezepte</h1>}
        <div className="flex flex-wrap gap-5 justify-center mb-5">
          {recipes.map((recipe) => (
            <RecipesCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.slug)}
              isAdded={addedOriginalIds.includes(recipe.id)}
            />
          ))}
        </div>
          {/* Load More Button */}
          {hasMore && (
            <Link
              href={`/?page=${page + 1}${
                query ? `&q=${query}` : ""
              }${genre ? `&genre=${genre}` : ""}${
                duration ? `&duration=${duration}` : ""
              }`}
              className='self-center'
            >
              <button className="mb-5 text-[#FF6048] cursor-pointer underline hover:text-[#eb3e2e]">
                Mehr laden
              </button>
            </Link>
          )}
      </div>

      {!isFiltered && (
      <div className='flex flex-col'>
        <h1 className='text-3xl mb-4 [@media(max-width:1472px)]:text-center'>Nudelgerichte</h1>
          <div className="flex flex-wrap gap-5 justify-center mb-5">
            {pastaRecipes.map((recipe) => (
              <RecipesCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.slug)}
                isAdded={addedOriginalIds.includes(recipe.id)}
              />
            ))}
          </div>
            <Link 
               key={genre} 
               href={`/?genre=${encodeURIComponent("Nudelgerichte")}`}
               className="self-center"
              >
                <button className="mb-5 text-[#FF6048] cursor-pointer underline hover:text-[#eb3e2e]">
                  Mehr laden
                </button>
            </Link>
      </div>
      )}

      {!isFiltered && (
      <div className='flex flex-col'>
        <h1 className='text-3xl mb-4 [@media(max-width:1472px)]:text-center'>Suppen</h1>
          <div className="flex flex-wrap gap-5 justify-center mb-5">
            {soupRecipes.map((recipe) => (
              <RecipesCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.slug)}
                isAdded={addedOriginalIds.includes(recipe.id)}
              />
            ))}
          </div>
            <Link 
               key={genre} 
               href={`/?genre=${encodeURIComponent("Suppen")}`}
               className="h-6 w-21 items-center"
              >
                <button className="mb-10 text-[#FF6048] cursor-pointer underline hover:text-[#eb3e2e]">
                  Mehr laden
                </button>
            </Link>
      </div>
      )}

      {!isFiltered && (
      <div className='flex flex-col'>
        <h1 className='text-3xl mb-4 [@media(max-width:1472px)]:text-center'>Asiatisch</h1>
          <div className="flex flex-wrap gap-5 justify-center mb-5">
            {asiaRecipes.map((recipe) => (
              <RecipesCard
                key={recipe.id}
                recipe={recipe}
                isFavorite={favorites.includes(recipe.slug)}
                isAdded={addedOriginalIds.includes(recipe.id)}
              />
            ))}
          </div>
            <Link 
               key={genre} 
               href={`/?genre=${encodeURIComponent("Asiatisch")}`}
               className="h-6 w-21 items-center"
              >
                <button className="mb-10 text-[#FF6048] cursor-pointer underline hover:text-[#eb3e2e]">
                  Mehr laden
                </button>
            </Link>
      </div>
      )}

    </div>
  );
}
