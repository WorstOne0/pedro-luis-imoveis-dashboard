"use client";

// Next
import Link from "next/link";
import { useParams } from "next/navigation";
// Models
import type { RealEstate } from "@/core/models";
// Hooks
import { useApiFetch } from "@/hooks";
// Components
import { EmptyState } from "@/components";
import RealEstateForm from "../../_components/real_estate_form";
// Icons
import { MdOutlineSearchOff } from "react-icons/md";

export default function Edit() {
  const { id } = useParams<{ id: string }>();
  const { data: realEstate, isLoading, error } = useApiFetch<RealEstate>(`/real_estate/${id}`);

  if (isLoading) return <div className="h-full w-full flex items-center justify-center text-[1.4rem] text-meta">Carregando imóvel...</div>;

  if (error || !realEstate) {
    return (
      <EmptyState
        Icon={MdOutlineSearchOff}
        title="Imóvel não encontrado"
        subtitle="Ele pode ter sido excluído."
        className="h-full"
        action={
          <Link href="/real_estate" className="h-[3.6rem] px-[1.4rem] flex items-center rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2">
            Ver todos os imóveis
          </Link>
        }
      />
    );
  }

  // Keyed on the id, so switching listings remounts the form with fresh defaults.
  return <RealEstateForm key={realEstate._id} realEstate={realEstate} />;
}
