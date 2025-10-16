'use client';
import React, { useEffect, useState } from 'react';
import { genres } from '@/lib/genres';
import Link from 'next/link';
import { useSearchParams, useRouter  } from 'next/navigation';

export default function GenreFilter({ context = "home", userId }: { context?: "home" | "favorites" | "recipes", userId?: string }) {
  const [open, setOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>("Rezeptart");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const genreFromParams = searchParams.get("genre");
    if (genreFromParams) {
      setSelectedGenre(genreFromParams);
    } else setSelectedGenre("Rezepart")
  }, [searchParams]);
  
  const getBasePath = () => {
    if (context === "favorites") return "/myrecipes";
    if (context === "recipes") return "/recipes";
    return "/";
  };

    const handleGenreClick = (genre: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (genre) {
      params.set("genre", genre);
      setSelectedGenre(genre);
    } else {
      params.delete("genre");
      setSelectedGenre("Rezeptart");
    }

    router.push(`${getBasePath()}?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className='relative'
    >
      <button 
        className="cursor-pointer transition hover:bg-[#eb3e2e] 
                   px-3 py-5 text-white text-left
                   md:h-13 md:w-30 md:transition md:bg-amber-0 md:px-6 md:hover:bg-gray-100 md:items-center justify-center md:text-gray-400 md:border-l-3 md:border-[#EED5C8] md:flex ">
        <p>{selectedGenre}</p>
      </button>

      {open && (
        <div className="absolute left-0 mt-0 bg-amber-100 shadow-md rounded p-2 space-y-1 z-10 w-48 md:w-auto">
          {genres.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={(e) => { e.preventDefault(); handleGenreClick(genre); }}
              className="block w-full text-left px-2 py-1 hover:bg-amber-50 rounded cursor-pointer"
            >
              {genre}
            </button>
          ))}

          <hr className="my-1 border-amber-200" />

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); handleGenreClick(null); }}
            className="block w-full text-left px-2 py-1 hover:bg-amber-50 rounded cursor-pointer text-gray-500"
          >
            Alle
          </button>
        </div>
      )}
    </div>
  );
}

