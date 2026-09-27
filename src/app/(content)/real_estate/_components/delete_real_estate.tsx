"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
// Services
import { api } from "@/services";
// Icons
import { MdOutlineDelete, MdOutlineWarningAmber } from "react-icons/md";

// The listing's delete action with its own confirmation step.
export default function DeleteRealEstate({ realEstateId, title, imageCount }: { realEstateId: string; title?: string; imageCount: number }) {
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      await api.delete(`/real_estate/${realEstateId}`);

      router.push("/real_estate");
      router.refresh();
    } catch (error) {
      setError((error as AxiosError<{ message?: string }>).response?.data?.message ?? "Não foi possível excluir o imóvel.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="h-[4.4rem] w-full flex items-center justify-center gap-[0.8rem] rounded-control border border-negative/40 text-[1.4rem] font-semibold text-negative hover:bg-negative-soft cursor-pointer"
      >
        <MdOutlineDelete size={18} />
        Excluir imóvel
      </button>

      {isConfirming && (
        <div className="p-[2rem] flex items-center justify-center bg-black/50 fixed inset-0 z-50" onClick={() => !isDeleting && setIsConfirming(false)}>
          <div className="w-full max-w-[46rem] p-[2.4rem] flex flex-col gap-[1.6rem] bg-surface rounded-card floating" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-[1rem] text-negative">
              <MdOutlineWarningAmber size={22} />
              <span className="text-[1.8rem] font-bold">Excluir imóvel</span>
            </div>

            <p className="text-[1.5rem] leading-[1.6] text-body">
              {title ? <strong className="font-semibold text-title">{title}</strong> : "Este imóvel"} será removido permanentemente
              {imageCount > 0 && `, junto com ${imageCount === 1 ? "1 imagem" : `${imageCount} imagens`}`}. Esta ação não pode ser desfeita.
            </p>

            <p className="text-[1.4rem] leading-[1.6] text-meta">
              Se o imóvel foi vendido, marque-o como <strong className="font-semibold text-title">vendido</strong> em vez de excluir — ele continua no histórico.
            </p>

            {error && <span className="px-[1.2rem] py-[1rem] rounded-control bg-negative-soft text-[1.4rem] text-negative">{error}</span>}

            <div className="mt-[0.4rem] flex gap-[1rem]">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                disabled={isDeleting}
                className="h-[4.4rem] grow flex items-center justify-center rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2 disabled:opacity-60 cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="h-[4.4rem] grow flex items-center justify-center gap-[0.8rem] rounded-control bg-negative text-[1.4rem] font-bold text-white hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                <MdOutlineDelete size={18} />
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
