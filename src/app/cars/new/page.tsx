'use client';

import { SearchComp } from '@/app/components/Search/Search';
import VehicleViewer from '@/app/components/VehicleCard/VehicleCard';

export default function NewCars() {
  return (
    <div className="">
      <header className='md:max-w-7xl md:mx-auto'>
          {/* <Navbar/> */}
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
