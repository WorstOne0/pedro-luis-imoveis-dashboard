"use client";

// Next
import { useState } from "react";
import { useRouter } from "next/navigation";
// Services
import { apiService } from "@/services";
// Icons
import { MdOutlineDelete, MdWarningAmber } from "react-icons/md";

/**
 * Delete action for a listing, with its own confirmation step.
 *
 * A plain overlay rather than a dialog component: the project has no dialog in
 * components/ui and this is the only place that needs one.
 */
export default function DeleteRealEstate({ realEstateId, title, imageCount }: { realEstateId: string; title?: string; imageCount: number }) {
  const router = useRouter();

  const [isConfirming, setIsConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDelete = async () => {
    setError(null);
    setIsDeleting(true);

    try {
      await apiService.delete(`/real_estate/${realEstateId}`);

      router.push("/real_estate");
      router.refresh();
    } catch (error: any) {
      setError(error?.response?.data?.message ?? "Não foi possível excluir o imóvel.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="h-[4.6rem] w-full flex justify-center items-center gap-[0.8rem] rounded-[1rem] border border-destructive/40 text-[1.5rem] font-semibold text-destructive cursor-pointer hover:bg-destructive/10"
      >
        <MdOutlineDelete size={18} />
        Excluir imóvel
      </button>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 p-[2rem]" onClick={() => !isDeleting && setIsConfirming(false)}>
          {/* Stops a click inside the card from reaching the backdrop's close. */}
          <div className="w-full max-w-[46rem] flex flex-col gap-[1.6rem] bg-card rounded-[1.6rem] p-[2.4rem]" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center gap-[1rem] text-destructive">
              <MdWarningAmber size={24} />
              <span className="text-[2rem] font-bold">Excluir imóvel</span>
            </div>

            <p className="text-[1.5rem] leading-[2.2rem] text-muted-foreground">
              {title ? <strong className="text-foreground">{title}</strong> : "Este imóvel"} será removido permanentemente
              {imageCount > 0 && `, junto com ${imageCount === 1 ? "1 imagem" : `${imageCount} imagens`}`}. Esta ação não pode ser desfeita.
            </p>

            <p className="text-[1.4rem] text-muted-foreground">
              Se o imóvel foi vendido, marque-o como <strong className="text-foreground">vendido</strong> em vez de excluir — ele continua no histórico.
            </p>

            {error && (
              <span className="text-[1.4rem] text-destructive border border-destructive/40 rounded-[1rem] px-[1.2rem] py-[1rem]">{error}</span>
            )}

            <div className="flex gap-[1rem] mt-[0.4rem]">
              <button
                type="button"
                onClick={() => setIsConfirming(false)}
                disabled={isDeleting}
                className="h-[4.6rem] grow flex justify-center items-center rounded-[1rem] border border-border text-[1.5rem] font-semibold disabled:opacity-60 cursor-pointer hover:bg-muted"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isDeleting}
                className="h-[4.6rem] grow flex justify-center items-center gap-[0.8rem] rounded-[1rem] bg-destructive text-white text-[1.5rem] font-bold disabled:opacity-60 cursor-pointer hover:opacity-90"
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
