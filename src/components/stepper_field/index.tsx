"use client";

import { useFormContext, Controller } from "react-hook-form";
import { FormLabel } from "@/components";
import { cn } from "@/lib/utils";
import { MdRemove, MdAdd } from "react-icons/md";

/**
 * Numeric field with -/+ buttons either side. Used for rooms, bathrooms,
 * garages and area, where the broker is usually nudging a small number rather
 * than typing one.
 */
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

        // Step from the live form value, not the `value` captured in this
        // render: several rapid clicks would otherwise all read the same stale
        // number and only advance by one in total.
        const step_ = (delta: number) => {
          const current = Number(getValues(name));
          const base = Number.isFinite(current) ? current : min;

          field.onChange(Math.max(base + delta, min));
        };

        const button = (label: string, icon: React.ReactNode, onClick: () => void, disabled = false) => (
          <button
            type="button"
            aria-label={label}
            onClick={onClick}
            disabled={disabled}
            className="h-[3.6rem] w-[3.6rem] shrink-0 flex justify-center items-center rounded-[0.6rem] cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {icon}
          </button>
        );

        return (
          <div className={cn("w-full flex flex-col gap-[0.8rem]", className)}>
            <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

            {/* One bordered box, buttons inside. With them outside, the actual
                input started ~4.6rem in and no longer lined up with the plain
                inputs in the neighbouring grid cells. */}
            <div className="h-[5rem] w-full flex items-center gap-[0.6rem] border border-input rounded-[0.8rem] pl-[1.2rem] pr-[0.6rem]">
              {startIcon && <span className="text-gray-500 shrink-0">{startIcon}</span>}

              <input
                type="number"
                className="min-w-0 grow bg-transparent text-[1.6rem] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={value}
                min={min}
                step={step}
                onChange={(event) => {
                  const next = event.target.valueAsNumber;
                  field.onChange(Number.isNaN(next) ? min : Math.max(next, min));
                }}
              />

              {suffix && <span className="text-[1.4rem] text-gray-500 shrink-0">{suffix}</span>}

              <span className="h-[2.4rem] w-px bg-input shrink-0 mx-[0.2rem]" />

              {button(`Diminuir ${label}`, <MdRemove size={18} />, () => step_(-step), value <= min)}
              {button(`Aumentar ${label}`, <MdAdd size={18} />, () => step_(step))}
            </div>
          </div>
        );
      }}
    />
  );
}
