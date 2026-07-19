"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormLabel } from "@/components";

/** Two or three mutually exclusive options shown side by side, e.g. Venda / Aluguel. */
export default function SegmentedField({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="w-full flex flex-col gap-[0.8rem]">
          <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

          <div className="h-[5rem] w-full flex items-center rounded-[0.8rem] border border-input p-[0.3rem]">
            {options.map((option) => {
              const isSelected = field.value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => field.onChange(option.value)}
                  className={`
                    h-full min-w-0 grow rounded-[0.6rem] text-[1.5rem] cursor-pointer transition-colors
                    ${isSelected ? "bg-card font-semibold shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}
                  `}
                >
                  {option.label}
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
