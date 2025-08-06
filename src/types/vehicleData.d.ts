declare module '@/data/vehicleData.json' {
  interface VehicleData {
    makes: string[];
    modelsByMake: Record<string, string[]>;
  }
  
  const vehicleData: VehicleData;
  export default vehicleData;
}
