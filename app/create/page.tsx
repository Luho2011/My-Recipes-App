import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CreateForm from "./CreateForm"; // Client-Komponente

export default async function CreatePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center mt-10">
        <h1 className="text-2xl font-semibold mb-4">
          Bitte einloggen, um Rezepte zu erstellen
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

  return <CreateForm />;
}