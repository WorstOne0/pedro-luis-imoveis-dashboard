import { create } from "zustand";

export type RealEstate = {
  _id: string;
  //
  title: string;
  description: string;
  type: string;
  sale: string;
  featured: boolean;
  sold: boolean;
  //
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  garages: number;
  //
  address: Address;
  //
  thumbnail: string;
  images: string[];
  //
  createdAt?: string;
  updatedAt?: string;
};

export type Address = {
  cep: string;
  street: string;
  district: string;
  city: string;
  state: string;
  complement: string;
  number: string;
  //
  position?: { lat: number; lng: number } | null;
};

// Only UI state lives here. The listing list and single listings come from
// useApiFetch/SWR, which owns caching and revalidation — keeping a second copy
// here meant the two could disagree.
type RealEstateStore = {
  realEstateSelected: RealEstate | null;
  setRealEstateSelected: (realEstate: RealEstate | null) => void;
};

const useRealEstateStore = create<RealEstateStore>((set) => ({
  realEstateSelected: null,
  setRealEstateSelected: (realEstate: RealEstate | null) => set({ realEstateSelected: realEstate }),
}));

export default useRealEstateStore;
