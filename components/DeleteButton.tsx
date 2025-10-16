'use client';
import { deleteFromFavorites, deleteFromUserRecipes } from '@/app/actions/createrecipes';
import { TrashIcon } from '@heroicons/react/24/solid';
import { useTransition } from 'react';

type Props = {
    id: string;
    context?: "favorites" | "recipes"; // Unterschiedliche Seiten
};

export default function DeleteButton({ id, context = "favorites" }: Props) {
    const actionFn = context === "recipes" ? deleteFromUserRecipes : deleteFromFavorites;
    const [isPending, startTransition] = useTransition();

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();

    const message =
      context === 'recipes'
        ? 'Sind Sie sicher, dass Sie dieses Rezept aus Ihren Rezepten entfernen möchten?'
        : 'Sind Sie sicher, dass Sie dieses Rezept aus Ihren Favoriten entfernen möchten?';

    const confirmed = window.confirm(message);
      if (!confirmed) return;

        startTransition(() => {
            actionFn(id); // 👈 direkt ID übergeben, kein FormData mehr
        });
    };

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="absolute bottom-2 right-2"
        >
            <TrashIcon className="cursor-pointer h-8 w-8 text-white transition-transform duration-300 hover:scale-135" />
        </button>
    );
}



