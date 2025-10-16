"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function editRecipe(formData: FormData) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return { message: "Nicht eingeloggt" };

  // OriginalId aus FormData
  const originalId = formData.get("originalId") as string;
  if (!originalId) return { message: "OriginalId fehlt" };

  // Werte aus FormData
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const ingredients = formData.get("ingredients") as string;
  const difficulty = formData.get("difficulty") as string;
  const duration = Number(formData.get("duration"));
  const genre = formData.get("genre") as string;
  const type = formData.get("type") as string;
  const potion = formData.get("potion") as string;
  const image = formData.get("image") as string | null;

  // Prüfen, ob schon eine Kopie dieses Originals für den User existiert
  const existingLink = await prisma.userRecipes.findFirst({
    where: {
      userId,
      originalId,
    },
    include: { recipe: true },
  });

  if (existingLink) {
    // Überschreiben: bestehende Kopie updaten
    await prisma.recipes.update({
      where: { id: existingLink.recipeId },
      data: {
        title,
        description,
        ingredients,
        difficulty,
        duration,
        genre,
        type,
        potion,
        image,
      },
    });
  } else {
    // Neue Kopie erstellen
    const slug = `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`;

    const copy = await prisma.recipes.create({
      data: {
        title,
        slug,
        description,
        ingredients,
        difficulty,
        duration,
        genre,
        type,
        potion,
        image,
        parentId: originalId, // Verweis auf Original
        userId,
      },
    });

    // Verknüpfung mit UserRecipes
    await prisma.userRecipes.create({
      data: {
        userId,
        recipeId: copy.id,
        originalId,
      },
    });
  }

  return { message: "Rezept erfolgreich gespeichert" };
}





