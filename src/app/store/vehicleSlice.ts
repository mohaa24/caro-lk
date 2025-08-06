import { create } from 'zustand'
import { VehicleType } from '../Types/CommonTypes'

interface VehicleTypeSlice {
  selectedVehicleType: VehicleType | null
  setVehicleType: (type: VehicleType) => void
  clearVehicleType: () => void
}

export const useVehicleTypeStore = create<VehicleTypeSlice>((set) => ({
  selectedVehicleType:VehicleType.Car,
  setVehicleType: (type) => set({ selectedVehicleType: type }),
  clearVehicleType: () => set({ selectedVehicleType: null }),
}))