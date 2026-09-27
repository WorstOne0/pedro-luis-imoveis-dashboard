// Components
import type { SelectOption } from "@/components";

// Every district in Cascavel, from the frontend's districts_geo.js: only names the public map can draw.
// Stored spellings win; accents the geo file drops are restored (matching ignores accents on both sides).
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

// Offered as one-tap additions in the form.
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
