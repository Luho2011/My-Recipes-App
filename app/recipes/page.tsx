import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import NavBar from "@/components/NavBar";
import RecipesCard from "@/components/RecipesCard";
import SearchBar from "@/components/SearchBar";

  type SearchParams = {
    q?: string;
    genre?: string;
    duration?: string;
  };

  export default async function RecipesPage({
    searchParams,
  }: {
    searchParams: Promise<SearchParams>;
  }) {
    
  const params = await searchParams; // ✅ Promise auflösen
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">
          Bitte einloggen, um deine Rezepte zu sehen
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

  // Bearbeitete Rezepte des Users via userRecipes
  const userRecipes = await prisma.userRecipes.findMany({
    where: { userId: session.user.id },
    include: { recipe: true },
    orderBy: { createdAt: "desc" },
  });


  // Filter nach Such-Query
  const filtered = userRecipes.filter(ur => {
    const r = ur.recipe;
    const matchesQuery = query ? r.title.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesDuration = duration ? r.duration <= duration : true;
    const matchesGenre = genre ? r.genre === genre : true; // <-- neu
    return matchesQuery && matchesDuration && matchesGenre;
  });

  const favs = await prisma.myrecipes.findMany({
    where: { userId: session.user.id },
    include: { recipe: { select: { id: true } } },
  });
  const favoriteIds = favs.map(f => f.recipe.id);

  return (
    <div className="flex flex-col items-center gap-6">
      <NavBar showSearch={false} context="recipes"/>
           <div className='w-2/3 md:h-22 md:px-6 md:mb-10 md:mt-10 flex items-center bg-[#EED5C8] rounded-[12px]'>
             <SearchBar context="recipes" currentGenre={genre} userId={session.user.id}/>
           </div> 
      <h1 className="text-3xl">Meine Rezepte</h1>
        <div className="flex flex-wrap gap-5 justify-center mb-5">
        {filtered.map((ur) => (
          <RecipesCard
            key={ur.recipe.id}
            recipe={{
              ...ur.recipe,
              duration: ur.recipe.duration.toString(),
              potion: ur.recipe.potion.toString(),
              image: ur.recipe.image || null,
            }}
            showAll
            userRecipeId={ur.id}
            isFavorite={favoriteIds.includes(ur.recipe.id)}
          />
        ))}
        </div>
    </div>
  );
}

