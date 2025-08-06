'use client';

import Navbar from '@/app/components/NavBar/NavBar';
import { SearchComp } from '@/app/components/Search/Search';
import VehicleViewer from './components/VehicleCard/VehicleCard';
import VehicleFilterSystem from './components/AdvancedFilter/AdvancedFilter';

export default function Home() {
  return (
    <div className="">
 
      <main className='max-w-7xl mx-auto'>
       <div className='mt-5 text-4xl'>Home page</div>
        {/* <SearchComp/>
        <VehicleViewer/> */}
        <VehicleFilterSystem/>
      </main>
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer> */}
    </div>
  );
}
