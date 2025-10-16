import React from 'react'
import { prisma } from '@/lib/prisma';
import RecipesCard from '@/components/RecipesCard';
import NavBar from '@/components/NavBar';

export default async function page({ params }: { params: { slug: string}}) {
    const recipe = await prisma.recipes.findUnique({
        where: {
          slug: params.slug,
        },
    });

  return (
    <div className='flex flex-col items-center relative'>
      <div className='bg-[#FF6048] top-0 w-full mb-5 h-[275px] md:h-[50px]'>
        < NavBar showSearch={false} showGenre={false}/>
      </div>
      <div className='w-full absolute top-15'>
        <RecipesCard recipe={recipe} variant="detail"/>
      </div>
    </div>
  )
}

