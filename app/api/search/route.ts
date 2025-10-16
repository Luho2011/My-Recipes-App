import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const context = searchParams.get("context") || "home";
  const userId = searchParams.get("userId") || undefined;
  const genre = searchParams.get("genre") || ""; // 🔹 NEU

  if (q.length < 2) return NextResponse.json([]);

  let results: any[] = [];

  if (context === "home") {
    // 🔹 Nur Original-Rezepte, optional nach Genre filtern
    results = await prisma.recipes.findMany({
      where: {
        parentId: null,
        title: { contains: q, mode: "insensitive" },
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}), // 🔥 wichtig
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    });
  } else if (context === "favorites") {
    if (!userId) return NextResponse.json([]);
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
        return matchesQuery && matchesGenre; // 🔥 nur Treffer im Genre
      })
      .slice(0, 5);
  } else if (context === "recipes") {
    if (!userId) return NextResponse.json([]);
    results = await prisma.recipes.findMany({
      where: {
        parentId: { not: null },
        userId,
        title: { contains: q, mode: "insensitive" },
        ...(genre ? { genre: { equals: genre, mode: "insensitive" } } : {}), // 🔥 auch hier
      },
      select: { id: true, title: true, slug: true },
      take: 5,
    });
  }

  return NextResponse.json(results);
}



