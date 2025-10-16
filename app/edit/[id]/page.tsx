import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { editRecipe } from "@/app/actions/editRecipe";

export default async function EditRecipePage(props: unknown) {
  // Type Assertion: props von Next.js auf { params: { id: string } } casten
  const { params } = props as { params: { id: string } };

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">
          Bitte einloggen, um Rezepte zu bearbeiten
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

  const recipe = await prisma.recipes.findUnique({ where: { id: params.id } });
  if (!recipe) return <h1>Rezept nicht gefunden</h1>;

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-3xl font-bold mb-6">Rezept bearbeiten: {recipe.title}</h1>

      <form
        action={async (formData) => {
          "use server";

          // OriginalId: Wenn Kopie -> parentId, sonst eigenes Id
          formData.append("originalId", recipe.parentId || recipe.id);

          await editRecipe(formData);
          redirect("/recipes");
        }}
        className="w-[500px] md:w-[750px] flex flex-col gap-4 bg-white shadow-md rounded-xl p-6"
      >
        <input type="text" name="title" defaultValue={recipe.title} className="border p-2 rounded" />
        <textarea name="description" defaultValue={recipe.description} className="border p-2 rounded h-24" />
        <textarea name="ingredients" defaultValue={recipe.ingredients} className="border p-2 rounded h-24" />
        <select name="difficulty" className="border p-2 mb-2 w-full" defaultValue={recipe.difficulty ?? "leicht"}>
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>
        <input type="number" name="duration" defaultValue={recipe.duration} className="border p-2 mb-2 w-full" />
        <input type="text" name="genre" defaultValue={recipe.genre} className="border p-2 rounded" />
        <select name="type" className="border p-2 mb-2 w-full" defaultValue={recipe.type ?? "Vegetarisch"}>
          <option value="Vegetarisch">Vegetarisch</option>
          <option value="vegan">Vegan</option>
          <option value="omnivor">Omnivor</option>
        </select>
        <input
          type="number"
          name="potion"
          placeholder={recipe.potion?.toString() ?? "1"}
          className="border p-2 mb-2 w-full"
          min="1"
        />
        <input type="text" name="image" defaultValue={recipe.image ?? ""} className="border p-2 rounded" />

        <button type="submit" className="bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Bearbeitete Kopie speichern
        </button>
      </form>
    </div>
  );
}





