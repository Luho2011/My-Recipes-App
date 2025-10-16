'use client';
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, ArrowLeftStartOnRectangleIcon, ArrowRightStartOnRectangleIcon, PlusIcon, HeartIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useSession } from "next-auth/react";
import Link from "next/link";
import SearchBar from './SearchBar';
import GenreFilter from './GenreFilter';
import Duration from './Duration';

type NavBarProps = {
  showSearch?: boolean;
  showGenre?: boolean;
  context?: "home" | "favorites" | "recipes"; // neuer Kontext
};

export default function NavBar({ showSearch = true, showGenre = true, context = "home" }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

return (
  <nav className="bg-[#FF6048] sticky top-0 z-10 w-full">
    {/* --- MOBILE HEADER --- */}
    <div className="flex items-center justify-between px-4 h-16 md:hidden">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menü öffnen"
        className="text-white cursor-pointer"
      >
        {menuOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <Bars3Icon className="h-8 w-8" />
        )}
      </button>

      <Link href="/" className="text-white text-3xl">
        <h1>rezepte</h1>
      </Link>

      {session ? (
        <form action="/api/auth/signout" method="post">
          <button type="submit">
            <ArrowRightStartOnRectangleIcon className="h-8 w-8 text-white hover:text-gray-200" />
          </button>
        </form>
      ) : (
        <Link href="/login">
          <ArrowLeftStartOnRectangleIcon className="h-8 w-8 text-white hover:text-gray-200" />
        </Link>
      )}
    </div>

    {/* Searchbar mobil */}
    {showSearch && (
      <div className="px-4 pb-2 md:hidden">
        <SearchBar context={context} userId={userId} />
      </div>
    )}

    {/* Mobile Dropdown Menü */}
    {menuOpen && (
      <div className="md:hidden bg-red shadow-lg border-t border-gray-200">
        <Link
          href="/create"
          onClick={() => setMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#eb3e2e] text-white text-center"
        >
          Rezept erstellen
        </Link>
        <Link
          href="/recipes"
          onClick={() => setMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#eb3e2e] text-white text-center"
        >
          Rezepte
        </Link>
        <Link
          href="/myrecipes"
          onClick={() => setMenuOpen(false)}
          className="block px-4 py-2 hover:bg-[#eb3e2e] text-white text-center"
        >
          Favoriten
        </Link>
        <div className='flex w-full border border-white'>
          {showGenre && (
            <div className="w-1/2 border-r-1 border-white cursor-pointer transition hover:bg-[#eb3e2e] text-center">
              <GenreFilter context={context}/>
            </div>
          )}
            <div className="w-1/2 border-l-1 border-white cursor-pointer transition hover:bg-[#eb3e2e] text-center">
              <Duration context={context} />
            </div>
        </div>
      </div>
    )}

    {/* --- DESKTOP NAVBAR --- */}
    <div className="hidden md:flex items-center justify-between h-16 w-full flex-wrap gap-y-2">
      
      {/* ✅ Linke Seite */}
      <div className="flex items-center gap-4 flex-shrink-0 justify-items-start">
        <div className="bg-[#eb3e2e] py-[10px] px-15 h-16">
          <Link href="/" className="text-white text-3xl font-bold">
            <h1 className='hover:scale-105'>rezepte</h1>
          </Link>
        </div>

        <Link
          href="/create"
          className="text-black bg-white h-9 px-4 rounded-[12px] hover:bg-gray-100 flex items-center justify-center"
        >
          <PlusIcon className="h-[26px] w-[26px] px-1 text-white bg-[#eb3e2e] hover:bg-[#e61e0c] rounded-[6px] mr-[6px]" />
          Neues Rezept
        </Link>
      </div>

      {/* ✅ Mitte (Searchbar) */}
      {showSearch && (
        <div className="flex-1 max-w-md mx-6 w-full">
          <SearchBar context={context} userId={userId} />
        </div>
      )}

      {/* ✅ Rechte Seite */}
      <div className="[@media(max-width:1169px)]:mr-0 flex items-center gap-6 flex-shrink flex-wrap mr-25">
        <Link href="/recipes" className="flex items-center hover:scale-105">
          <BookOpenIcon className="h-5 w-5 mr-1 text-white" />
          <p className="text-white underline mr-6">Rezepte</p>
        </Link>

        <Link href="/myrecipes" className="flex items-center hover:scale-105">
          <HeartIcon className="h-5 w-5 mr-1 text-white" />
          <p className="text-white underline mr-12">Favoriten</p>
        </Link>

        {session ? (
          <form action="/api/auth/signout" method="post">
            <button type="submit">
              <ArrowRightStartOnRectangleIcon className="h-8 w-8 text-white hover:text-gray-200 cursor-pointer" />
            </button>
          </form>
        ) : (
          <Link href="/login">
            <ArrowLeftStartOnRectangleIcon className="h-8 w-8 text-white hover:text-gray-200 cursor-pointer" />
          </Link>
        )}
      </div>
    </div>
  </nav>
);

}


