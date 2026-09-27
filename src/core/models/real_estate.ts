// Keys match the enums in the backend real_estate model. Order is the order the filter shows them.
export const PROPERTY_TYPES = {
  apartment: { label: "Apartamento", short: "Apto" },
  house: { label: "Casa", short: "Casa" },
  sobrado: { label: "Sobrado", short: "Sobrado" },
  shop: { label: "Comercial", short: "Comercial" },
  land: { label: "Terreno", short: "Terreno" },
};

export const SALE_TYPES = {
  sell: "Venda",
  rent: "Aluguel",
  both: "Venda/Aluguel",
};

export type PropertyType = keyof typeof PROPERTY_TYPES;
export type SaleType = keyof typeof SALE_TYPES;

export type Address = {
  _id: string;
  targetId: string;
  cep: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  // A plain { lat, lng } object from Mongo, not a google.maps.LatLng instance.
  position?: google.maps.LatLngLiteral | null;
};

export type RealEstate = {
  _id: string;
  title: string;
  description: string;
  type: PropertyType;
  sale: SaleType;
  featured: boolean;
  sold: boolean;
  price: number;
  area: number;
  rooms: number;
  bathrooms: number;
  garages: number;
  address: Address;
  features?: string[];
  thumbnail: string;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
};

// Most imported listings have no title of their own.
export const realEstateTitle = (realEstate: RealEstate) => {
  if (realEstate.title?.trim()) return realEstate.title.trim();

  const type = PROPERTY_TYPES[realEstate.type]?.label ?? "Imóvel";
  const deal = realEstate.sale === "rent" ? "para alugar" : "à venda";
  const district = realEstate.address?.district;

  return district ? `${type} ${deal} no ${district}` : `${type} ${deal} em ${realEstate.address?.city || "Cascavel"}`;
};

// The legacy import wrote {lat: 0, lng: 0} where a listing had no coordinates, which plots it off Africa.
export const hasRealPosition = (realEstate: RealEstate) => {
  const position = realEstate.address?.position;
  if (!position) return false;

  return Number.isFinite(position.lat) && Number.isFinite(position.lng) && !(position.lat === 0 && position.lng === 0);
};
