'use client';

import { Suspense } from 'react';
import { SearchComp } from '@/app/components/Search/Search';
import VehicleViewer from './components/VehicleCard/VehicleCard';

function HomeContent() {
  return (
    <div className="">
      <main className='max-w-7xl mx-auto'>
       {/* <div className='mt-5 text-4xl'>Home page</div> */}
        <SearchComp/>
         <VehicleViewer/>
        {/* <VehicleFilterSystem/> */}
      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer> */}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
