'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams} from 'next/navigation';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import GenreFilter from './GenreFilter';
import Duration from './Duration';

type SearchBarProps = {
  context: "home" | "favorites" | "recipes"; // aktueller Seiten-Kontext
  userId?: string; // für favorites & bearbeitete Rezepte
  currentGenre?: string;
};

export default function SearchBar({ context, userId, currentGenre }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const durations = [15, 30, 45, 60, 75, 90];

  // 🔹 Fetch Vorschläge vom Server
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      let url = `/api/search?q=${query}&context=${context}`;
      if (userId) url += `&userId=${userId}`;
      if (currentGenre) url += `&genre=${currentGenre}`;
      const res = await fetch(url);
      const data = await res.json();
      setSuggestions(data);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [query, context, userId]);

  // 🔹 Submit (Enter oder Button „Los“)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);

    let url = "";

    if (context === "home") {
      url = `/?q=${query}`;
      if (currentGenre) url += `&genre=${currentGenre}`;
    }
    if (context === "favorites") url = `/myrecipes?q=${query}`;
    if (context === "recipes") url = `/recipes?q=${query}`;

    router.push(url);
  };

    // 🔹 Dauer auswählen
const handleDurationClick = (min: number) => {
  let url = '';

  if (context === "home") {
    // Aktuelles Genre berücksichtigen
    const currentGenre = searchParams.get('genre'); // z.B. "Nudelgerichte"
    const currentQuery = searchParams.get('q');
    url = `/?duration=${min}${query ? `&q=${query}` : ''}${currentGenre ? `&genre=${currentGenre}` : ''}`;
  } else if (context === "favorites") {
    url = `/myrecipes?duration=${min}${query ? `&q=${query}` : ''}${currentGenre ? `&genre=${currentGenre}` : ''}`;
  } else if (context === "recipes") {
    url = `/recipes?duration=${min}${query ? `&q=${query}` : ''}${currentGenre ? `&genre=${currentGenre}` : ''}`;
  }

  router.push(url);
  setOpen(false);
};

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Suchen..."
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-13 pl-15 pr-4 py-2 rounded-[12px] bg-white focus:outline-none"
        />
        <button
          type="submit"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          <MagnifyingGlassIcon className="ml-4 h-5 w-5" />
        </button>

        <div className='invisible md:visible absolute top-0 right-50'>
          <GenreFilter context={context} userId={userId} />
        </div>

        {/* Dauer Dropdown als Hover */}
        <div className="invisible md:visible absolute right-20 top-0">
          <Duration context={context} />
        </div>

            <button
              type="submit"
              className="text-white cursor-pointer bg-[#FF6048] hover:bg-[#eb3e2e] w-20 absolute right-0 top-0 h-13 rounded-r-[12px] text-center"
            >
              LOS
            </button>

      </form>

      {/* 🔹 Vorschläge Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute mt-1 w-full bg-white border rounded-xl shadow-lg z-10">
          {suggestions.map((recipe) => (
            <li key={recipe.id}>
            <Link
              href={
                context === "home"
                  ? `/?q=${recipe.title}${currentGenre ? `&genre=${currentGenre}` : '' }`
                  : context === "favorites"
                  ? `/myrecipes?q=${recipe.title}` // ✅ Favoriten-Link
                  : `/recipes?q=${recipe.title}`
              }
              className="block px-3 py-2 hover:bg-gray-100 rounded-xl"
              onClick={() => setSuggestions([])}
            >
              {recipe.title}
            </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
