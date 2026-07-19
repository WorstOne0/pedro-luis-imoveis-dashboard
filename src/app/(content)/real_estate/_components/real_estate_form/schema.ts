import { z } from "zod";

export const RealEstateSchema = z.object({
  title: z.string().min(1, "Informe um título"),
  description: z.string().min(1, "Informe uma descrição"),
  type: z.string().min(1, "Selecione o tipo"),
  sale: z.string().min(1, "Selecione a negociação"),
  //
  price: z.coerce.number().positive("Informe um preço"),
  area: z.coerce.number().positive("Informe a área"),
  rooms: z.coerce.number().min(0),
  bathrooms: z.coerce.number().min(0),
  garages: z.coerce.number().min(0),
  featured: z.boolean(),
  features: z.array(z.string()),
  //
  address: z.object({
    cep: z.string().min(1, "Informe o CEP"),
    street: z.string().min(1, "Informe a rua"),
    district: z.string().min(1, "Informe o bairro"),
    city: z.string().min(1, "Informe a cidade"),
    state: z.string().min(1, "Informe o estado"),
    complement: z.string(),
    number: z.string().min(1, "Informe o número"),
  }),
});

export type RealEstateFormValues = z.infer<typeof RealEstateSchema>;

export const EMPTY_REAL_ESTATE: RealEstateFormValues = {
  title: "",
  description: "",
  type: "",
  sale: "sell",
  //
  price: 0,
  area: 0,
  rooms: 0,
  bathrooms: 0,
  garages: 0,
  featured: false,
  features: [],
  //
  address: {
    cep: "",
    street: "",
    district: "",
    city: "",
    state: "",
    complement: "",
    number: "",
  },
};
