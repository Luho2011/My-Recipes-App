'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams} from 'next/navigation';


export default function Duration({ context }: { context: "home" | "favorites" | "recipes" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<string>("Dauer");
  const durations = [15, 30, 45, 60, 75, 90];

  useEffect(() => {
    const durationFromParams = searchParams.get("duration");
    if (durationFromParams) {
      setSelectedDuration(`< ${durationFromParams} Min`);
    } else {
      setSelectedDuration("Dauer");
    }
  }, [searchParams]);
  
  const getBasePath = () => {
    if (context === "favorites") return "/myrecipes";
    if (context === "recipes") return "/recipes";
    return "/";
  };

  const handleDurationClick = (min: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) {
      params.set("duration", min.toString());
      setSelectedDuration(`< ${min} Min`);
    } else {
      params.delete("duration");
      setSelectedDuration("Dauer");
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
          <button className="cursor-pointer transition hover:bg-[#eb3e2e]
                             px-8 py-5 text-white
                             md:h-13 md:w-30 md:transition md:bg-amber-0 md:hover:bg-gray-100 md:px-3 md:py-2 md:text-gray-400 md:border-l-3 md:border-r-3 border-[#EED5C8]">
            <p>{selectedDuration}</p>
          </button>

          {open && (
            <div className="absolute left-0 mt-0 bg-amber-100 shadow-md rounded p-2 space-y-1 z-10 w-36">
              {durations.map((min) => (
                <button
                  type='button'
                  key={min}
                  onClick={(e) => { e.preventDefault(); handleDurationClick(min); }}
                  className="block w-full px-2 py-1 hover:bg-amber-50 rounded cursor-pointer"
                >
                  {'<'} {min} Min
                </button>
              ))}
              <hr className="my-1 border-amber-200" />

<button
  onClick={() => handleDurationClick(null)} // <-- Reset
  className="block w-full px-2 py-1 hover:bg-amber-50 rounded cursor-pointer text-gray-500"
>
  Alle
</button>
            </div>
          )}

    </div>
  )
}