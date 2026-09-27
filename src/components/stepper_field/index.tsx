"use client";

// Next
import { Controller, useFormContext } from "react-hook-form";
// Utils
import { cn } from "@/utils";
// Icons
import { MdOutlineAdd, MdOutlineRemove } from "react-icons/md";

// -/+ around a number: rooms, bathrooms, garages and area are nudged far more often than typed.
export default function StepperField({
  name,
  label,
  step = 1,
  min = 0,
  suffix,
  startIcon,
  className,
}: {
  name: string;
  label: string;
  step?: number;
  min?: number;
  suffix?: string;
  startIcon?: React.ReactNode;
  className?: string;
}) {
  const { control, getValues } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const value = Number.isFinite(field.value) ? Number(field.value) : min;

        // From the live form value: rapid clicks would all read this render's stale `value` and advance once.
        const nudge = (delta: number) => {
          const current = Number(getValues(name));
          field.onChange(Math.max((Number.isFinite(current) ? current : min) + delta, min));
        };

        const buildButton = (buttonLabel: string, icon: React.ReactNode, onClick: () => void, disabled = false) => (
          <button
            type="button"
            aria-label={buttonLabel}
            onClick={onClick}
            disabled={disabled}
            className="h-[3.2rem] w-[3.2rem] shrink-0 flex items-center justify-center rounded-control text-body transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {icon}
          </button>
        );

        return (
          <div className={cn("w-full flex flex-col gap-[0.6rem]", className)}>
            <span className="text-[1.3rem] font-semibold text-body">{label}</span>

            {/* Buttons inside the one box, so the number lines up with the plain inputs beside it. */}
            <div className="h-[4.4rem] w-full pl-[1.4rem] pr-[0.6rem] flex items-center gap-[0.4rem] rounded-control border border-line bg-surface focus-within:border-action">
              {startIcon && <span className="shrink-0 text-soft">{startIcon}</span>}

              <input
                type="number"
                value={value}
                min={min}
                // "any", not `step`: as an HTML step it rejected every value between multiples (67 m² was invalid).
                step="any"
                onChange={(event) => {
                  const next = event.target.valueAsNumber;
                  field.onChange(Number.isNaN(next) ? min : Math.max(next, min));
                }}
                className="min-w-0 grow bg-transparent text-[1.5rem] text-title tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />

              {suffix && <span className="shrink-0 text-[1.3rem] text-meta">{suffix}</span>}

              <span className="h-[2.4rem] w-px mx-[0.2rem] shrink-0 bg-line" />

              {buildButton(`Diminuir ${label}`, <MdOutlineRemove size={18} />, () => nudge(-step), value <= min)}
              {buildButton(`Aumentar ${label}`, <MdOutlineAdd size={18} />, () => nudge(step))}
            </div>
          </div>
        );
      }}
    />
  );
}
