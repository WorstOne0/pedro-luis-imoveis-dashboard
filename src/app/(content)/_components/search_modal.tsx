/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// Controllers
import { useSearchController } from "@/core/controllers";
// Models
import { PROPERTY_TYPES, realEstateTitle, type RealEstate } from "@/core/models";
// Hooks
import { useApiFetch } from "@/hooks";
// Utils
import { formatBRL } from "@/utils";
// Icons
import { MdOutlineSearch } from "react-icons/md";

export default function SearchModal() {
  const router = useRouter();
  const isOpen = useSearchController((state) => state.isOpen);
  const setIsOpen = useSearchController((state) => state.setIsOpen);

  const [term, setTerm] = useState("");

  // The sidebar's SWR key, so searching costs no request.
  const { data: realEstateList } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");

  const matches = useMemo(() => {
    const needle = term.trim().toLowerCase();
    const list = realEstateList ?? [];
    if (!needle) return list.slice(0, 8);

    return list
      .filter((item) => [item.title, item.address?.district, item.address?.street, item._id].some((field) => String(field ?? "").toLowerCase().includes(needle)))
      .slice(0, 8);
  }, [realEstateList, term]);

  if (!isOpen) return null;

  const close = () => {
    setIsOpen(false);
    setTerm("");
  };

  const open = (id: string) => {
    close();
    router.push(`/real_estate/edit/${id}`);
  };

  return (
    <div className="pt-[12vh] flex justify-center bg-black/40 backdrop-blur-sm fixed inset-0 z-[100]" onClick={close}>
      <div className="h-fit w-full max-w-[64rem] mx-[2rem] bg-surface rounded-card floating overflow-hidden" onClick={(event) => event.stopPropagation()}>
        <label className="h-[5.6rem] px-[1.6rem] flex items-center gap-[1rem] border-b border-line">
          <MdOutlineSearch size={20} className="shrink-0 text-soft" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") close();
              if (event.key === "Enter" && matches[0]) open(matches[0]._id);
            }}
            placeholder="Buscar por título, bairro ou código..."
            className="min-w-0 grow bg-transparent text-[1.6rem] text-title placeholder:text-muted focus:outline-none"
          />
          <span className="h-[2.4rem] px-[0.6rem] flex items-center rounded-[0.4rem] bg-surface-2 text-[1.1rem] font-semibold text-meta">ESC</span>
        </label>

        <div className="max-h-[48rem] p-[0.6rem] flex flex-col overflow-y-auto scrollbar-thin">
          {matches.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => open(item._id)}
              className="w-full px-[1rem] py-[0.8rem] flex items-center gap-[1.2rem] rounded-control text-left hover:bg-surface-2 cursor-pointer"
            >
              <span className="h-[4.4rem] w-[4.4rem] shrink-0 rounded-control bg-surface-3 overflow-hidden">
                {item.thumbnail && <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />}
              </span>

              <span className="min-w-0 grow flex flex-col">
                <span className="text-[1.4rem] font-semibold text-title truncate">{realEstateTitle(item)}</span>
                <span className="text-[1.2rem] text-meta truncate">
                  {PROPERTY_TYPES[item.type]?.label ?? "Imóvel"} · {item.address?.district || "sem bairro"}
                </span>
              </span>

              <span className="shrink-0 text-[1.4rem] font-semibold text-title tabular-nums">{formatBRL(item.price)}</span>
            </button>
          ))}

          {matches.length === 0 && <span className="px-[1rem] py-[2rem] text-center text-[1.4rem] text-meta">Nenhum imóvel encontrado para “{term}”.</span>}
        </div>
      </div>
    </div>
  );
}
