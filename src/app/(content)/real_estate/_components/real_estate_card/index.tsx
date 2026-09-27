/* eslint-disable @next/next/no-img-element */
"use client";

// Models
import { PROPERTY_TYPES, SALE_TYPES, type RealEstate } from "@/core/models";
// Utils
import { formatBRL } from "@/utils";
// Icons
import { MdOutlineBed, MdOutlineShower, MdOutlineGarage, MdOutlineSquareFoot, MdOutlineLocationOn, MdOutlineImage } from "react-icons/md";

const CHIP = "h-[2.4rem] px-[0.8rem] flex items-center rounded-control text-[1.1rem] font-bold uppercase tracking-[0.06em]";

// The public site's `preview` card — restyle one, restyle the other. It tolerates empty fields, so it
// also backs the form's live preview; `thumbnail` takes the local url of a cover not uploaded yet.
export default function RealEstateCard({ realEstate, onClickCallback, thumbnail }: { realEstate: RealEstate; onClickCallback?: () => void; thumbnail?: string }) {
  const address = realEstate.address;
  const cover = thumbnail ?? realEstate.thumbnail;
  const location = [address?.district, address?.city].filter(Boolean).join(" · ");
  const badge = [PROPERTY_TYPES[realEstate.type]?.label, SALE_TYPES[realEstate.sale]].filter(Boolean).join(" · ");
  const stats = [
    { key: "rooms", Icon: MdOutlineBed, value: realEstate.rooms, label: "quartos" },
    { key: "bathrooms", Icon: MdOutlineShower, value: realEstate.bathrooms, label: "banheiros" },
    { key: "garages", Icon: MdOutlineGarage, value: realEstate.garages, label: "vagas" },
  ].filter((stat) => Number(stat.value) > 0);

  return (
    <div onClick={onClickCallback} className={`surface overflow-hidden select-none ${onClickCallback ? "surface-interactive" : ""}`}>
      <div className="h-[17rem] w-full flex items-center justify-center bg-surface-3 relative">
        {cover && <img className={`h-full w-full object-cover ${realEstate.sold ? "grayscale-[0.6] opacity-80" : ""}`} src={cover} alt={realEstate.title ?? ""} />}

        {!cover && (
          <span className="flex flex-col items-center gap-[0.4rem] text-soft">
            <MdOutlineImage size={30} />
            <span className="text-[1.2rem]">Sem capa</span>
          </span>
        )}

        {/* Sold wins over featured: a sold listing is not something to promote. */}
        <div className="flex gap-[0.6rem] absolute top-[1rem] left-[1rem]">
          {realEstate.sold && <span className={`${CHIP} bg-negative text-white`}>Vendido</span>}
          {realEstate.featured && !realEstate.sold && <span className={`${CHIP} bg-attention-soft text-attention`}>Destaque</span>}
        </div>

        {badge && (
          <span className="h-[2.4rem] px-[0.8rem] flex items-center rounded-control bg-surface/90 text-[1.2rem] font-semibold text-title absolute bottom-[1rem] left-[1rem]">
            {badge}
          </span>
        )}
      </div>

      <div className="p-[1.4rem] flex flex-col gap-[0.4rem]">
        <span className="text-[2.2rem] font-bold text-title tabular-nums leading-[2.6rem]">{realEstate.price > 0 ? formatBRL(realEstate.price) : "R$ —"}</span>
        <span className="text-[1.5rem] font-semibold text-title leading-[2rem] line-clamp-2">{realEstate.title || "Sem título"}</span>

        <span className="flex items-center gap-[0.4rem] text-[1.3rem] text-meta">
          <MdOutlineLocationOn size={15} className="shrink-0" />
          <span className="truncate">{location || "Endereço não preenchido"}</span>
        </span>

        {(stats.length > 0 || realEstate.area > 0) && (
          <div className="mt-[0.8rem] pt-[1rem] flex items-center justify-between gap-[1rem] border-t border-line text-[1.3rem] text-body">
            <div className="flex items-center gap-[1.4rem]">
              {stats.map(({ key, Icon, value, label }) => (
                <span key={key} title={`${value} ${label}`} className="flex items-center gap-[0.5rem] tabular-nums">
                  <Icon size={17} className="text-soft" />
                  {value}
                </span>
              ))}
            </div>

            {realEstate.area > 0 && (
              <span className="flex items-center gap-[0.5rem] shrink-0 tabular-nums">
                <MdOutlineSquareFoot size={17} className="text-soft" />
                {realEstate.area} m²
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
