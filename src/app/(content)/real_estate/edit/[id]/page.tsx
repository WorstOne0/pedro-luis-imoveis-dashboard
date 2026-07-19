"use client";

// Next
import { useParams } from "next/navigation";
// Components
import RealEstateForm from "@/app/(content)/real_estate/_components/real_estate_form";
import { useApiFetch } from "@/hooks";
import type { RealEstate } from "@/store/useRealEstateStore";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const { data: realEstate, isLoading, error } = useApiFetch<RealEstate>(`/real_estate/${id}`);

  if (isLoading) {
    return <div className="h-full w-full flex justify-center items-center text-[1.8rem] italic text-gray-500">Carregando imóvel...</div>;
  }

  if (error || !realEstate) {
    return <div className="h-full w-full flex justify-center items-center text-[1.8rem] italic text-gray-500">Imóvel não encontrado.</div>;
  }

  // Keyed on the id so switching listings remounts the form with fresh
  // defaultValues instead of keeping the previous record's state.
  return <RealEstateForm key={realEstate._id} realEstate={realEstate} />;
}
