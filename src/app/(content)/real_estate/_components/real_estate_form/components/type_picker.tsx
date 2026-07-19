"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormLabel } from "@/components";
//
import { MdOutlineApartment, MdOutlineHouse, MdOutlineHomeWork, MdOutlineStorefront, MdOutlineCropSquare } from "react-icons/md";

// Values must match the enum in the backend real_estate model. Labels are the
// short forms from the mockup — the full names only fit in a dropdown.
const TYPES = [
  { value: "apartment", label: "Apto", icon: MdOutlineApartment },
  { value: "house", label: "Casa", icon: MdOutlineHouse },
  { value: "sobrado", label: "Sobrado", icon: MdOutlineHomeWork },
  { value: "shop", label: "Comercial", icon: MdOutlineStorefront },
  { value: "land", label: "Terreno", icon: MdOutlineCropSquare },
];

/**
 * Property type as a row of buttons rather than a select. There are only five
 * options and they never grow, so hiding them behind a dropdown costs a click
 * and shows nothing in return.
 */
export default function TypePicker({ name = "type" }: { name?: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="w-full flex flex-col gap-[0.8rem]">
          <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">Tipo de imóvel</FormLabel>

          <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-[1rem]">
            {TYPES.map((type) => {
              const isSelected = field.value === type.value;

              return (
                <button
                  key={type.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => field.onChange(type.value)}
                  className={`
                    h-[7.4rem] flex flex-col justify-center items-center gap-[0.6rem] rounded-[1rem] border transition-colors cursor-pointer
                    ${isSelected ? "border-primary bg-primary/5 text-primary font-semibold" : "border-border text-muted-foreground hover:bg-muted"}
                  `}
                >
                  <type.icon size={20} />
                  <span className="text-[1.3rem]">{type.label}</span>
                </button>
              );
            })}
          </div>

          {fieldState.error && <span className="text-[1.3rem] text-destructive px-[0.4rem]">{fieldState.error.message}</span>}
        </div>
      )}
    />
  );
}
