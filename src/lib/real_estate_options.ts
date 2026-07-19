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
