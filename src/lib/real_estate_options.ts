import type { SelectOption } from "@/components/select_field";

// Values must match the enum in the backend real_estate model.
export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "land", label: "Terreno" },
  { value: "shop", label: "Sala Comercial" },
  { value: "sobrado", label: "Sobrado" },
];

export const SALE_OPTIONS: SelectOption[] = [
  { value: "sell", label: "Venda" },
  { value: "rent", label: "Aluguel" },
  { value: "both", label: "Venda e Aluguel" },
];

export const propertyTypeLabel = (type: string) => PROPERTY_TYPE_OPTIONS.find((option) => option.value === type)?.label ?? type;

/**
 * Every district in Cascavel, taken from the frontend's districts_geo.js so the
 * dashboard can only produce names the public map is able to draw. A free-text
 * field let "Tropical " (trailing space) and "tropical" into the data, and
 * neither matches the map's polygon.
 *
 * Where a district already appears in the catalogue, its stored spelling wins —
 * that is what the API filters on. Accents the geo file drops (Brasília,
 * Guarujá, Universitário, São Cristóvão) are restored here: district matching
 * is accent-insensitive on both sides, so correcting them is safe and stops new
 * records inheriting the typo.
 */
export const DISTRICT_OPTIONS: SelectOption[] = [
  "14 de Novembro",
  "Alto Alegre",
  "Brasília",
  "Brasmadeira",
  "Canadá",
  "Cancelli",
  "Cascavel Velho",
  "Cataratas",
  "Centro",
  "Coqueiral",
  "Country",
  "Esmerald",
  "Fag",
  "Floresta",
  "Guarujá",
  "Interlagos",
  "Maria Luiza",
  "Morumbi",
  "Neva",
  "Pacaembu",
  "Parque São Paulo",
  "Parque Verde",
  "Periolo",
  "Pioneiros Catarinenses",
  "Recanto Tropical",
  "Região do Lago",
  "Santa Cruz",
  "Santa Felicidade",
  "Santos Dumont",
  "São Cristóvão",
  "Universitário",
  "Vista Linda",
].map((name) => ({ value: name, label: name }));

// Common selling points, offered as one-tap additions in the form.
export const FEATURE_SUGGESTIONS = [
  "Suíte master",
  "Cozinha planejada",
  "Espaço gourmet",
  "Churrasqueira",
  "Sacada",
  "Closet",
  "Escritório",
  "Lavanderia",
  "Piscina",
  "Portaria 24h",
  "Elevador",
  "Academia",
];
