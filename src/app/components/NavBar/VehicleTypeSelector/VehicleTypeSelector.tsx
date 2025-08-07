'use client'

import { useVehicleTypeStore } from '@/app/store/vehicleSlice'
import { VehicleType } from '@/app/Types/CommonTypes'
import { JSX, useState } from 'react'

export const VehicleTypeSelector = (): JSX.Element => {
  const { selectedVehicleType, setVehicleType } = useVehicleTypeStore()
  const [activeType, setActiveType] = useState<VehicleType | null>(selectedVehicleType)

  const handleClick = (type: VehicleType) => {
    setActiveType(type)
    setVehicleType(type)
  }

  const render = (items: VehicleType[]) =>
    items.map((type) => (
      <button
        onClick={() => handleClick(type)}
        key={type}
        className={`flex items-center space-x-2 text-sm font-bold whitespace-nowrap ${
          activeType === type ? 'text-gray-950 border-b-2 border-red-700' : 'text-gray-400 hover:text-gray-500'
        }`}
      >
        <span>{type}</span>
      </button>
    ))

  return (
    
    <div className="hidden md:block bg-white">
      <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide pt-1 font-bold">
        {render(Object.values(VehicleType))}
      </div>
    </div>
  )
}
