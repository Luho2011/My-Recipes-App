'use client';
import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ClockIcon, HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { PlusCircleIcon as PlusCircleIconOutline } from '@heroicons/react/24/outline';
import { PlusCircleIcon as PlusCircleIconSolid } from '@heroicons/react/24/solid';
import DeleteButton from './DeleteButton';
import { useActionState } from 'react';
import { addToMyfavorites, addToUserRecipes } from '@/app/actions/createrecipes'
import { deleteFromFavorites, deleteFromUserRecipes } from '@/app/actions/createrecipes'
import Link from 'next/link';
import { useRouter } from "next/navigation";

type Props = {
    recipe: {
        image: string | null; 
        id: string;
        title: string;
        description: string;
        ingredients: string;
        difficulty: string;
        potion: string;
        duration: string;
        genre: string;
        type: string;
        slug: string;
    };
    showDelete?: boolean;   // Favoriten -> nur Delete
    showAll?: boolean;      // Recipes -> alle drei
    variant?: "default" | "detail";
    isFavorite?: boolean;
    isAdded?: boolean;
    userRecipeId?: string;
}

export default function RecipesCard({ recipe, showDelete = false, showAll = false, userRecipeId, variant = "default", isFavorite = false, isAdded = false }: Props) {
  const [showMessage, setShowMessage] = React.useState(false);
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [added, setAdded] = React.useState(isAdded);
  const [portions, setPortions] = React.useState(Number(recipe.potion) || 1);
  const originalPortions = Number(recipe.potion) || 1;
  const router = useRouter();

    React.useEffect(() => {
    setFavorite(isFavorite);
    }, [isFavorite]);

    const handleToggleFavorite = async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setFavorite(prev => !prev);

      if (!favorite) {
        await addToMyfavorites(recipe);
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 1500);
      } else {
        await deleteFromFavorites(recipe.id);
      }
    };

    const handleToggleAdd = async (e: React.MouseEvent) => {
      e.preventDefault();

      setAdded(prev => !prev);

      if (!added) {
        await addToUserRecipes(recipe);
      } else {
        await deleteFromUserRecipes(recipe.id)
      }
    };

    const handlePortionChange = (value: number) => {
      if (value < 1) return;
       setPortions(value);
    };


  // Zutaten: Mengen fett darstellen und skalieren
  function renderIngredients(ingredients: string) {
    const factor = portions / originalPortions;

    return ingredients
      .split('\n')
      .filter(Boolean)
      .map((line, i) => {
        // Zahlen im Text erkennen (inkl. Kommazahlen)
        const scaledLine = line.replace(/(\d+([.,]\d+)?)/g, (match) => {
          const num = parseFloat(match.replace(',', '.'));
          if (isNaN(num)) return match;
          const scaled = Math.round(num * factor * 100) / 100;
          return scaled.toString().replace('.', ',');
        });

        const isAmount = /^\d+/.test(line) || /^\d+(g|ml|EL)/i.test(line);
        return (
          <p key={i} className={isAmount ? 'font-bold mt-3 mb-1' : 'mt-0 mb-1'}>
            {scaledLine}
          </p>
        );
      });
  }

  // Zubereitung: Schritte fett + Trennstrich
  function renderPreparation(preparation: string) {
    return preparation
      .split(/\n(?=\d+\.)/)
      .map((step, i) => {
        const [title, ...desc] = step.split('\n').filter(Boolean);
        return (
          <div key={i} className="mb-4">
            <p className="font-bold mb-1">{title}</p>
            {desc.map((d, j) => (
              <p key={j} className="mb-1">{d}</p>
            ))}
            <hr className="border-t-2 border-black mt-10" />
          </div>
        );
      });
  }

const [sticky, setSticky] = React.useState(false);
const containerRef = React.useRef<HTMLDivElement>(null);

React.useEffect(() => {
  const handleScroll = () => {
    if (!containerRef.current) return;
    const scroll = containerRef.current.scrollTop;
    setSticky(scroll >= 102); // Bildhöhe / 2 = 204/2 = 102
  };
  const container = containerRef.current;
  container?.addEventListener("scroll", handleScroll);
  return () => container?.removeEventListener("scroll", handleScroll);
}, []);

  const [activeTab, setActiveTab] = React.useState(0);
  const scrollRefs = React.useRef<{ [key: number]: number }>({});
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleTabSelect = (index: number) => {
    // aktuelle Position speichern
    if (scrollContainerRef.current) {
      scrollRefs.current[activeTab] = scrollContainerRef.current.scrollTop;
    }

    setActiveTab(index);

    // Scroll zurücksetzen auf gespeicherte Position
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollRefs.current[index] || 0;
      }
    });
  };

  return (
    <>
      <Link href={`/recipesdetails/${recipe.slug}`}
         onClick={(e) => {
            if (variant === "detail") e.preventDefault();
         }}
         className="cursor-pointer">
        <form
          action={variant === "default" ? formAction : undefined}
          className={`${variant === "default"
            ? 'bg-white rounded-xl shadow-md border border-gray-200 w-[350px] h-[235px] relative transition-transform duration-300 hover:scale-105'
            : 'bg-[#FBEBE3] w-full md:rounded-t-3xl md:w-[90%] md:max-w-[1400px] md:mx-auto flex flex-col items-center mt-3 mb-3 md:mt-8 md:mb-5 relative'}`}
        >
          <button
            onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               router.push(`/edit/${recipe.id}`);
             }}
             className="absolute top-2 right-15 cursor-pointer transition-transform duration-300 hover:scale-110"
             >
               <PencilSquareIcon className="hidden md:inline h-8 w-8 text-black z-10" />
          </button>
          {/* Typ-Icon */}
          {recipe.type && (
            <div className={`${variant === "default" ? 'absolute bottom-2 right-2 bg-white rounded-full p-1 shadow' : 'absolute right-4 top-2 md:bg-white rounded-full p-1'}`}>
              {recipe.type === "Vegetarisch" && <span title="Vegetarisch" className={`${variant === "detail" ? "hidden md:inline md:shadow" : ""}`}>🧀</span>}
              {recipe.type === "vegan" && <span title="vegan" className={`${variant === "detail" ? "hidden md:inline md:shadow" : ""}`}>🥦</span>}
            </div>
          )}

          {showMessage && !showDelete && (
            <div className="absolute top-25 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm p-2 rounded shadow transition">
              <h1>Rezept hinzugefügt!</h1>
            </div>
          )}

          {/* --- DEFAULT VARIANTE --- */}
          {variant === "default" && (
            <>
              {/* Bild */}
              <div className="relative w-full h-[175px] rounded-t-lg overflow-hidden shadow-md">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />

                {/* --- Buttons --- */}
                {showAll ? (
                  <>
                   <DeleteButton id={userRecipeId || recipe.id} context="recipes" />

                    <button
                      onClick={handleToggleFavorite}
                      className="absolute top-3 right-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      {favorite ? (
                        <HeartIconSolid className="h-8 w-8 text-white fill-white z-10 drop-shadow-xl" />
                      ) : (
                      <>  <HeartIcon className="absolute top-0 left-0 h-8 w-8 text-white" />
                          <HeartIconSolid className="h-8 w-8 text-black/25 hover:text-white z-10" />
                      </>
                      )}
                    </button>
                  </>
                ) : showDelete ? (
                  <DeleteButton id={recipe.id} />
                ) : (
                  <>
                    <button
                      onClick={handleToggleFavorite}
                      className="absolute top-3 right-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      {favorite ? (
                        <HeartIconSolid className="h-8 w-8 text-white fill-white z-10 drop-shadow-xl" />
                      ) : (
                      <>  <HeartIcon className="absolute top-0 left-0 h-8 w-8 text-white" />
                          <HeartIconSolid className="h-8 w-8 text-black/25 hover:text-white z-10" />
                      </>
                      )}
                    </button>

                      <button
                        onClick={handleToggleAdd}
                        className="absolute top-13 right-2 cursor-pointer text-white transition-transform duration-300 hover:scale-110"
                      >
                        {added ? (
                        <PlusCircleIconSolid className="h-[35px] w-[35px] text-white hover:text-white z-10" />
                        ) : (
                        <> <PlusCircleIconOutline className="absolute top-0 left-0 h-[35px] w-[35px] text-white" />
                           <PlusCircleIconSolid className="h-[35px] w-[35px] text-black/25 hover:text-white z-10 " />
                        </>
                        )}
                      </button>
                  </>
                )}
              </div>

              {/* Titel */}
              <h2 className="text-[22px] text-gray-800 mt-2 ml-5 w-[230px]">{recipe.title}</h2>
            </>
          )}

          {/* --- DETAIL VARIANTE --- */}
          {variant === "detail" && (
            <>
              {/* Desktop Layout */}
              <div className="hidden md:flex flex-col bg-[#FBEBE3] rounded-xl w-full max-w-[1400px] mx-auto">
                <div className='bg-[#EED5C8] flex pl-5 pb-6 pt-1 rounded-2xl'>
                  <div className="relative w-[450px] h-[275px] mt-5 ml-2">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                   {showAll ? (
                  <>
                    <button
                      onClick={handleToggleFavorite}
                      className="absolute top-3 right-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      {favorite ? (
                        <HeartIconSolid className="h-8 w-8 text-white fill-white z-10 drop-shadow-xl" />
                      ) : (
                      <>  <HeartIcon className="absolute top-0 left-0 h-8 w-8 text-white" />
                          <HeartIconSolid className="h-8 w-8 text-black/25 hover:text-white z-10" />
                      </>
                      )}
                    </button>
                  </>
                ) : showDelete ? (
                  <DeleteButton id={recipe.id} />
                ) : (
                  <>
                    <button
                      onClick={handleToggleFavorite}
                      className="absolute top-3 right-2 cursor-pointer transition-transform duration-300 hover:scale-110"
                    >
                      {favorite ? (
                        <HeartIconSolid className="h-8 w-8 text-white fill-white z-10 drop-shadow-xl" />
                      ) : (
                      <>  <HeartIcon className="absolute top-0 left-0 h-8 w-8 text-white" />
                          <HeartIconSolid className="h-8 w-8 text-black/25 hover:text-white z-10" />
                      </>
                      )}
                    </button>

                      <button
                        onClick={handleToggleAdd}
                        className="absolute top-15 right-2 cursor-pointer text-white transition-transform duration-300 hover:scale-110"
                      >
                        {added ? (
                        <PlusCircleIconSolid className="h-[35px] w-[35px] text-white hover:text-white z-10 drop-shadow-xl" />
                        ) : (
                        <> <PlusCircleIconOutline className="absolute top-0 left-0 h-[35px] w-[35px] text-white" />
                           <PlusCircleIconSolid className="h-[35px] w-[35px] text-black/25 hover:text-white z-10 " />
                        </>
                        )}
                      </button>
                  </>
                )}
                  </div>
                    <div className="flex flex-col mt-8 ml-8">
                      <p className='border border-amber-300 rounded-[8px] p-1 bg-amber-300 mb-2 w-fit text-center'>{recipe.genre}</p>
                      <h2 className="text-4xl font-semibold mb-3 mt-2">{recipe.title}</h2>
                      <div className='flex flex-col w-full mb-5'>
                        <p className='font-semibold mt-6 flex gap-1'> <ClockIcon className='h-5 w-5 mt-[2px]' /> Kochzeit: {recipe.duration} Min</p>
                        <div className="flex items-center gap-3 mt-6">
                          <p className="font-semibold">Portionen: {portions}</p>

                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handlePortionChange(portions - 1);
                            }}
                            className="bg-white text-black font-bold text-2xl cursor-pointer h-6 w-6 rounded-md  hover:bg-gray-100 flex items-center justify-center"
                          >
                            {'−'}
                          </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handlePortionChange(portions + 1);
                              }}
                              className="bg-white text-black font-bold text-2xl cursor-pointer h-6 w-6 rounded-md  hover:bg-gray-100 flex items-center justify-center"
                            >
                              +
                            </button>
                        </div>
                      </div>
                    </div>
                </div>         

                  <div className="flex bg-[#FBEBE3] mt-10 w-full">
                    <div className="md:w-[20%] w-full pr-3 pl-3">
                      {renderIngredients(recipe.ingredients)}
                    </div>
                    <div className="md:w-2/3 ml-15 pl-3 mt-3 rounded-br-xl whitespace-pre-line">
                      {renderPreparation(recipe.description)}
                    </div>
                  </div>
              </div>


                {/* Mobile Layout */}
                <div
                  ref={containerRef}
                  className="md:hidden w-full flex flex-col overflow-hidden"
                >
                  <Tabs 
                      selectedIndex={activeTab}
                      onSelect={(index) => {
                        // aktuelle Position speichern
                        if (scrollContainerRef.current) {
                          scrollRefs.current[activeTab] = scrollContainerRef.current.scrollTop;
                        }

                        setActiveTab(index);

                        // Scroll zurücksetzen auf gespeicherte Position
                        requestAnimationFrame(() => {
                          if (scrollContainerRef.current) {
                            scrollContainerRef.current.scrollTop = scrollRefs.current[index] || 0;
                          }
                        });
                      }}
                      className="flex flex-col flex-1"
                  >
                    {/* Obere Sektion */}
                    <div className={`bg-[#FBEBE3] ${sticky ? "sticky top-0 z-20" : ""}`}>
                      {/* Bild + TabList */}
                      <div className='bg-[#FF6048] w-full'>
                        <div className="relative w-[92%] mx-auto h-[220px] overflow-hidden">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-full h-full mt-[1px] object-cover rounded-t-3xl"
                          />
                          <TabList className="absolute bottom-0 left-7 flex gap-2">
                            <Tab className="react-tabs__tab">Zutaten</Tab>
                            <Tab className="react-tabs__tab">Rezept</Tab>
                            <Tab className="react-tabs__tab">Notizen</Tab>
                          </TabList>
                        </div>
                      </div>

                      {/* Info-Bereich */}
                      <div className="pt-3 pl-5">
                        <p className='border border-amber-300 rounded-[8px] p-1 bg-amber-300 w-fit mb-2 text-[13px] text-black'>
                          {recipe.genre}
                        </p>
                        <h2 className="text-3xl font-semibold text-black mb-3 w-[92%]">{recipe.title}</h2>
                        <div className='flex w-[92%] justify-between mb-5'>
                          <p className='font-semibold text-black'>Kochzeit: {recipe.duration} Min</p>
                          <div className="flex items-center gap-3">
                            <p className="font-semibold">Portionen: {portions}</p>
                            <button
                              onClick={(e) => { e.preventDefault(); handlePortionChange(portions - 1); }}
                              className="bg-white text-black font-bold text-2xl cursor-pointer h-6 w-6 rounded-md hover:bg-gray-100 flex items-center justify-center"
                            >
                              {'−'}
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); handlePortionChange(portions + 1); }}
                              className="bg-white text-black font-bold text-2xl cursor-pointer h-6 w-6 rounded-md hover:bg-gray-100 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scrollbarer Bereich für die ersten beiden TabPanels */}
                    <div
                      ref={scrollContainerRef}
                      className="flex-1 w-full px-5 mx-auto bg-white"
                        style={{
                          overflowY: "auto",
                          maxHeight: "calc(100vh - 204px - 112px)", // Bild + Info-Bereich
                        }}
                      // 204px Bild + 112px Info-Bereich Höhe geschätzt, anpassen wenn nötig
                    >
                      <TabPanel className="w-full">{renderIngredients(recipe.ingredients)}</TabPanel>
                      <TabPanel className="w-full mt-3">{renderPreparation(recipe.description)}</TabPanel>
                    </div>
                      <style jsx>{`
                        div::-webkit-scrollbar {
                          display: none;
                        }
                        div {
                          scrollbar-width: none; /* Firefox */
                        }
                      `}</style>

                    {/* Notizen-Tab statisch */}
                    <div className="w-[92%] max-w-[450px] mx-auto mt-3">
                      <TabPanel className="w-full">
                        <p className="italic text-gray-500">
                          Hier könnten deine persönlichen Notizen stehen…
                        </p>
                      </TabPanel>
                    </div>
                  </Tabs>
                </div>

            </>
          )}

          {/* Hidden Inputs */}
          {!showDelete && (
            <>
              <input type="hidden" name="title" value={recipe.title} />
              <input type="hidden" name="description" value={recipe.description} />
              <input type="hidden" name="ingredients" value={recipe.ingredients} />
              <input type="hidden" name="difficulty" value={recipe.difficulty} />
              <input type="hidden" name="potion" value={recipe.potion} />
              <input type="hidden" name="duration" value={recipe.duration} />
              <input type="hidden" name="genre" value={recipe.genre} />
              <input type="hidden" name="type" value={recipe.type} />
              <input type="hidden" name="slug" value={recipe.slug} />
              <input type="hidden" name="id" value={recipe.id} />
            </>
          )}
        </form>
      </Link>
    </>
  )
}
