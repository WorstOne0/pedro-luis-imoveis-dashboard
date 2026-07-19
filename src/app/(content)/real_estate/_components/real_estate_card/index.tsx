/* eslint-disable @next/next/no-img-element */
"use client";

// Store
import { RealEstate } from "@/store/useRealEstateStore";
import { useRealEstateStore } from "@/store";
// Components
import { Card } from "@/components/ui/card";
import { propertyTypeLabel } from "@/lib/real_estate_options";
// Icons
import { MdOutlineBed, MdOutlineShower, MdImage } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { PiGarage } from "react-icons/pi";
import { BiArea, BiExpand } from "react-icons/bi";

const SALE_LABELS: Record<string, string> = { sell: "Venda", rent: "Aluguel", both: "Venda e Aluguel" };

const formatBRL = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0, minimumFractionDigits: 0 });

/**
 * - `default` the original listing card, image on top of a stats row
 * - `preview` compact hero card: badge over the image, price, title, location
 *   and a divided stats footer. Tolerates empty fields, so it doubles as the
 *   live preview while a listing is still being filled in.
 *
 * Kept in step with the frontend's card of the same name.
 */
export type CardVariant = "default" | "preview";

export default function RealEstateCard({
  realEstate,
  onClickCallback,
  variant = "default",
  // Overrides realEstate.thumbnail — the form passes a local object URL for a
  // file that has not been uploaded yet.
  thumbnail,
}: {
  realEstate: RealEstate;
  onClickCallback?: () => void;
  variant?: CardVariant;
  thumbnail?: string;
}) {
  const setRealEstateSelected = useRealEstateStore((state) => state.setRealEstateSelected);

  const address = realEstate.address;
  const cover = thumbnail ?? realEstate.thumbnail;

  const handleCardClick = () => {
    if (onClickCallback) onClickCallback();
    setRealEstateSelected(realEstate);
  };

  // ---- preview -----------------------------------------------------------
  if (variant === "preview") {
    const location = [address?.district, address?.city, address?.state].filter(Boolean).join(" · ");

    const stats = [
      { key: "rooms", Icon: MdOutlineBed, value: realEstate.rooms },
      { key: "bathrooms", Icon: MdOutlineShower, value: realEstate.bathrooms },
      { key: "garages", Icon: PiGarage, value: realEstate.garages },
    ].filter((stat) => Number(stat.value) > 0);

    const badge = [realEstate.type && propertyTypeLabel(realEstate.type), SALE_LABELS[realEstate.sale]].filter(Boolean).join(" · ");

    return (
      <Card className="w-full bg-card rounded-[1.6rem] overflow-hidden select-none">
        <div className="h-[18rem] w-full bg-muted flex justify-center items-center relative">
          {cover ? (
            <img className="h-full w-full object-cover object-center" src={cover} alt={realEstate.title ?? ""} />
          ) : (
            <div className="flex flex-col items-center text-muted-foreground">
              <MdImage size={32} />
              <span className="text-[1.2rem] mt-1">Sem capa</span>
            </div>
          )}

          {badge && (
            <span className="text-[1.2rem] font-semibold text-white bg-black/70 rounded-[0.6rem] px-[0.8rem] py-[0.4rem] absolute bottom-[1rem] left-[1rem]">
              {badge}
            </span>
          )}
        </div>

        <div className="w-full flex flex-col gap-[0.6rem] p-[1.6rem]">
          <span className="text-[2.4rem] font-bold leading-[2.8rem]">{realEstate.price > 0 ? formatBRL(realEstate.price) : "R$ —"}</span>

          <span className="text-[1.6rem] font-semibold leading-[2rem]">{realEstate.title || "Sem título"}</span>

          <div className="flex items-center gap-[0.6rem] text-muted-foreground">
            <FaLocationDot size={12} className="shrink-0" />
            <span className="text-[1.3rem] truncate">{location || "Endereço não preenchido"}</span>
          </div>

          {(stats.length > 0 || realEstate.area > 0) && (
            <div className="w-full flex items-center justify-between gap-[1rem] border-t border-border pt-[1.2rem] mt-[0.6rem]">
              <div className="flex items-center gap-[1.4rem] text-muted-foreground">
                {stats.map(({ key, Icon, value }) => (
                  <div key={key} className="flex items-center gap-[0.5rem]">
                    <Icon size={16} />
                    <span className="text-[1.4rem]">{value}</span>
                  </div>
                ))}
              </div>

              {realEstate.area > 0 && (
                <div className="flex items-center gap-[0.5rem] text-muted-foreground shrink-0">
                  <BiExpand size={16} />
                  <span className="text-[1.4rem]">{realEstate.area} m²</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  // ---- default -----------------------------------------------------------
  const location = [address?.street, address?.number, address?.district, address?.city, address?.state].filter(Boolean).join(", ");

  const stats = [
    { key: "rooms", Icon: MdOutlineBed, value: realEstate.rooms, label: "quartos" },
    { key: "bathrooms", Icon: MdOutlineShower, value: realEstate.bathrooms, label: "banheiros" },
    { key: "garages", Icon: PiGarage, value: realEstate.garages, label: "vagas" },
    { key: "area", Icon: BiArea, value: realEstate.area, label: "m²" },
  ].filter((stat) => Number(stat.value) > 0);

  return (
    <Card
      className="w-full flex flex-col select-none cursor-pointer bg-card rounded-[1rem] overflow-hidden relative hover:shadow-md transition-shadow"
      onClick={handleCardClick}
    >
      <div className="h-[22rem] w-full">
        <img className="h-full w-full object-cover object-center" src={cover} alt={realEstate.title ?? ""} />
      </div>

      <div className="grow flex flex-col gap-[0.6rem] px-[1.5rem] pt-[1.2rem] pb-[1.4rem]">
        <div className="flex justify-between items-center gap-[1rem]">
          <span className="text-[2.6rem] font-extrabold leading-none">{formatBRL(realEstate.price)}</span>
          <span className="text-[1.4rem] text-muted-foreground shrink-0">{propertyTypeLabel(realEstate.type)}</span>
        </div>

        <div className="flex items-center flex-wrap gap-x-[1.8rem] gap-y-[0.4rem] text-muted-foreground">
          {stats.map(({ key, Icon, value, label }) => (
            <div key={key} className="flex items-center gap-[0.5rem]">
              <Icon size={16} className="shrink-0" />
              <span className="font-bold text-[1.5rem]">
                {value} {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-[0.6rem] select-text text-muted-foreground">
          <FaLocationDot size={12} className="shrink-0 mt-[0.4rem]" />
          <span className="text-[1.4rem] leading-[2rem]">{location || "Endereço não informado"}</span>
        </div>
      </div>
    </Card>
  );
}
