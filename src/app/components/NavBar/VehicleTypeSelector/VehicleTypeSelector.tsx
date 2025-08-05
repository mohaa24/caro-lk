import { JSX, useState } from "react"

const VehicleTypes:string[] = ['Cars', 'Vans', 'Bikes','Three Wheelers','Caravans','Trucks','Farm','Plant','Electric bikes']

export const VehicleTypeSelector = ():JSX.Element=>{
    const [activeType, setActiveType] = useState('Cars');
    const render = (items:string[])=>{
       return items.map((i:string) =>  <button onClick={()=> setActiveType(i)} key={''} className={`flex items-center space-x-2 ${activeType === i && 'text-gray-950'} text-sm text-gray-400 font-bold whitespace-nowrap ${activeType === i && 'border-b-2 border-red-700'} hover:text-gray-500`}>
              <span>{i}</span>
            </button>)
    }
    return(  <div className=" hidden md:block bg-white">
        <div className=" ">
          <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide pt-1 font-bold">
       {render (VehicleTypes)}
          </div>
        </div>
      </div>)
}