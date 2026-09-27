"use client";

// Next
import { Controller, useFormContext } from "react-hook-form";

// Two or three exclusive options side by side, e.g. Venda / Aluguel.
export default function SegmentedField({ name, label, options }: { name: string; label: string; options: { value: string; label: string }[] }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="w-full flex flex-col gap-[0.6rem]">
          <span className="text-[1.3rem] font-semibold text-body">{label}</span>

          <div className="h-[4.4rem] w-full p-[0.3rem] flex items-center gap-[0.2rem] rounded-control bg-surface-3">
            {options.map((option) => {
              const isSelected = field.value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => field.onChange(option.value)}
                  className={`h-full min-w-0 grow rounded-[0.4rem] text-[1.4rem] transition-colors cursor-pointer
                    ${isSelected ? "bg-surface font-semibold text-title outline outline-line" : "text-meta hover:text-title"}`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {fieldState.error && <span className="text-[1.3rem] text-negative">{fieldState.error.message}</span>}
        </div>
      )}
    />
  );
}
