"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { nanoid } from "nanoid"; // oder uuid

// Hilfsfunktion: erzeugt einen slug aus dem Titel
function slugify(text: string) {
  if (!text) text = "untitled"; // fallback, falls kein Titel
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')       
    .replace(/[^\w\-]+/g, '')   
    .replace(/\-\-+/g, '-')     
    .replace(/^-+/, '')         
    .replace(/-+$/, '');
}

// Hilfsfunktion: stellt sicher, dass der slug einzigartig ist
async function generateUniqueSlug(title: string) {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let count = 1;

  while (await prisma.recipes.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${count}`;
    count++;
  }
  return uniqueSlug;
}

export async function createRecipe(prevState: unknown, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const ingredients = formData.get("ingredients") as string;
  const difficulty = formData.get("difficulty") as string;
  const duration = Number(formData.get("duration"));
  const genre = formData.get("genre") as string;
  const type = formData.get("type") as string;
  const potion = Number(formData.get("potion"));
  const image = formData.get("image") as string | null;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  const slug = await generateUniqueSlug(title);

  await prisma.recipes.create({
    data: {
      title,
      slug,
      description,
      ingredients,
      difficulty,
      duration,
      genre,
      type,
      potion: potion.toString(),
      image, // ✅ Cloudinary URL
      user: { connect: { id: userId } },
    },
  });

  return { message: "Rezept erstellt" };
}



export async function addToMyfavorites(recipe: { id: string }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  // 💡 Favorit immer genau das aktuelle Rezept (egal ob Original oder Kopie)
  await prisma.myrecipes.create({
    data: {
      user: { connect: { id: userId } },
      recipe: { connect: { id: recipe.id } },
    },
  });

  revalidatePath('/');
  revalidatePath('/recipes');
  revalidatePath('/myrecipes');

  return { message: "Rezept zu Favoriten hinzugefügt" };
}


export async function deleteFromFavorites(recipeId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  await prisma.myrecipes.deleteMany({
    where: { userId, recipeId },
  });

  revalidatePath('/myrecipes');
  revalidatePath('/recipes');
  return { message: "Favorit gelöscht" };
}

// Server-Action: Rezept in "Meine Rezepte" hinzufügen
export async function addToUserRecipes(recipe: Recipe) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  // Original-Rezept holen
  const original = await prisma.recipes.findUnique({
    where: { id: recipe.id },
  });
  if (!original) return { message: "Rezept nicht gefunden" };

  // Kopie erstellen
  const newRecipe = await prisma.recipes.create({
    data: {
      title: original.title,
      description: original.description,
      ingredients: original.ingredients,
      difficulty: original.difficulty,
      duration: original.duration,
      genre: original.genre,
      type: original.type,
      potion: original.potion,
      image: original.image,
      parentId: original.id, // Verweis auf Original
      userId,
      slug: `${original.title.toLowerCase().replace(/\s+/g, "-")}-${nanoid(6)}`,
    },
  });

  // Relation in UserRecipes anlegen
  await prisma.userRecipes.create({
    data: {
      userId,
      recipeId: newRecipe.id,
      originalId: original.id,
    },
  });

  return { message: "Rezept hinzugefügt" };
}

export async function deleteFromUserRecipes(userRecipeId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  // Verknüpfung finden
  const link = await prisma.userRecipes.findFirst({
    where: { id: userRecipeId, userId },
  });

  if (link) {
    // erst Link löschen
    await prisma.userRecipes.delete({ where: { id: userRecipeId } });
    // dann die Kopie des Rezepts
    await prisma.recipes.delete({ where: { id: link.recipeId } });
  }

  revalidatePath('/recipes');
  return { message: "Rezept gelöscht" };
}



