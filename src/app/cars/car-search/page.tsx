'use client';

import { Suspense } from 'react';
import VehicleFilterSystem from '@/app/components/AdvancedFilter/AdvancedFilter';

function CarSearchContent() {
  return (
    <div className="">
      <header className='md:max-w-7xl md:mx-auto'>
          {/* <Navbar/> */}
      </header>
      <main className='max-w-7xl mx-auto'>
       <VehicleFilterSystem/>
        {/* <SearchComp/> */}
        {/* <VehicleViewer/> */}
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}

export default function CarSearch() {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <CarSearchContent />
    </Suspense>
  );
}
