'use client';

import { Suspense } from 'react';
import Navbar from '@/app/components/NavBar/NavBar';
import { SearchComp } from '@/app/components/Search/Search';
import VehicleViewer from '../components/VehicleCard/VehicleCard';

function CarsPageContent() {
  return (
    <div className="">
      <header className='md:max-w-7xl md:mx-auto'>
          <Navbar/>
      </header>
      <main className='max-w-7xl mx-auto'>
       
        <SearchComp/>
        <VehicleViewer/>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CarsPageContent />
    </Suspense>
  );
}
