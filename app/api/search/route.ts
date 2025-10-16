import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RecipeResult = {
  id: string;
  title: string;
  slug: string;
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const context = searchParams.get("context") || "home";
  const userId = searchParams.get("userId") || undefined;
  const genre = searchParams.get("genre") || "";

  if (q.length < 2) return NextResponse.json([] as RecipeResult[]);

  let results: RecipeResult[] = [];

  if (context === "home") {
    results = await prisma.recipes.findMany({
      where: {
        parentId: null,
        title: { contains: q, mode: "insensitive" },
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}),
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    });
  } else if (context === "favorites") {
    if (!userId) return NextResponse.json([] as RecipeResult[]);
    const favs = await prisma.myrecipes.findMany({
      where: { userId },
      include: { recipe: true },
    });
    results = favs
      .map(f => f.recipe)
      .filter(r => {
        const matchesQuery = r.title.toLowerCase().includes(q.toLowerCase());
        const matchesGenre = genre
          ? r.genre?.toLowerCase() === genre.toLowerCase()
          : true;
        return matchesQuery && matchesGenre;
      })
      .slice(0, 5)
      .map(r => ({ id: r.id, title: r.title, slug: r.slug })); // nur die 3 Felder
  } else if (context === "recipes") {
    if (!userId) return NextResponse.json([] as RecipeResult[]);
    results = await prisma.recipes.findMany({
      where: {
        parentId: { not: null },
        userId,
        title: { contains: q, mode: "insensitive" },
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}),
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    });
  }

  return NextResponse.json(results);
}




