"use client";
import React, { useEffect, useState } from 'react';
import { genres } from '@/lib/genres';
import { useActionState } from 'react';
import { createRecipe } from '../actions/createrecipes';
import { startTransition } from "react";
import NavBar from '@/components/NavBar';
import { useRouter } from "next/navigation";

export default function CreateForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(createRecipe, { message: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (state.message) {
      setShowMessage(true);
      const timer = setTimeout(() => setShowMessage(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [state.message]);

  // ---------------- File Upload ----------------
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.secure_url) setImageUrl(data.secure_url);
  }

  // ---------------- Form Submit ----------------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!imageUrl) return alert("Bitte ein Bild hochladen!");

    const formData = new FormData(e.currentTarget);
    formData.append("image", imageUrl); // ✅ URL direkt hinzufügen

    startTransition(async () => {
    await formAction(formData); // ohne await hier, state wird korrekt getrackt
    router.push("/");
    router.refresh(); 
  });
  }

  return (
    <div className='flex flex-col items-center'>
      <NavBar showSearch={false} showGenre={false}/>
      <div className='flex items-center justify-center relative w-full mt-4'>
        <h1 className='text-3xl mt-3'>Erstelle dein Rezept</h1>
      </div>

      <form onSubmit={handleSubmit} className='bg-white w-[400px] md:w-[750px] mt-10 flex flex-col items-center rounded-2xl px-6'>
        <input type='text' placeholder='Titel...' name='title'
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib einen Titel ein')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        className='border p-2 mb-2 w-full mt-5' 
        />
        <textarea placeholder={'Zutaten\n 700 g\n Tomaten \n 200 ml \n Milch'} name='ingredients'
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Zutaten an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        className='border p-2 mb-2 w-full'
         />
        <textarea placeholder={'1. Nudeln kochen\n Beschreibung\n Absatz \n 2. Zwiebeln vorbereiten \n Beschreibung\n Absatz'} name='description'
        className='border p-2 mb-2 w-full'
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Beschreibung an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
         />
        <select name="difficulty" 
        className="border p-2 mb-2 w-full" defaultValue=""
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Schwierigkeit an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        >
          <option value="" disabled>Schwierigkeit wählen</option>
          <option value="leicht">Leicht</option>
          <option value="mittel">Mittel</option>
          <option value="schwer">Schwer</option>
        </select>
        <input type="number" name="potion" placeholder="Portionen"
         className="border p-2 mb-2 w-full" min="1"
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Portionen an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
         />
        <input type="number" name="duration" placeholder="Dauer in Min" 
        className="border p-2 mb-2 w-full" 
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Dauer an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        />
        <select name="genre"
        className="border p-2 mb-2 w-full" defaultValue=""
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib Rezeptart an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        >
          <option value="" disabled>Art des Rezeptes</option>
          {genres.map((genre) => (<option key={genre} value={genre}>{genre}</option>))}
        </select>
        <select name="type" 
        className="border p-2 mb-2 w-full" defaultValue=""
        required
        onInvalid={(e) => e.currentTarget.setCustomValidity('Bitte gib vegetarisch/vegan/omnivor an')}
        onInput={(e) => e.currentTarget.setCustomValidity('')}
        >
          <option value="" disabled>Vegetarisch/Vegan?</option>
          <option value="Vegetarisch">Vegetarisch</option>
          <option value="vegan">Vegan</option>
          <option value="omnivor">Omnivor</option>
        </select>

        <div className="flex justify-center mb-2 w-[600px] max-[750px]:w-[380px]">
          <label htmlFor="file-upload" className="cursor-pointer bg-amber-300 px-4 py-2 rounded-md hover:bg-amber-200">
            Bild hochladen
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover mt-2 mb-2" />
        )}

        <button type='submit' className='bg-green-600 hover:bg-green-400 text-white px-3 py-1 w-[150px] rounded-md cursor-pointer mb-10'>
          Rezept erstellen
        </button>

        {showMessage && (
          <div className="absolute bot-25 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm p-2 rounded shadow transition">
            <h1>Rezept erstellt</h1>
          </div>
        )}
      </form>
    </div>
  );
}