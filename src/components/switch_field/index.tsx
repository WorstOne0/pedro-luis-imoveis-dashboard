"use client";

// Next
import { Controller, useFormContext } from "react-hook-form";
// Components
import Switch from "../switch";

// `reverse` puts the label first and the switch at the far end, for a full-width settings row.
export default function SwitchField({ name, label, description, reverse = false }: { name: string; label: string; description?: string; reverse?: boolean }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`w-full flex items-center gap-[1.2rem] ${reverse ? "flex-row-reverse justify-between" : ""}`}>
          <Switch id={name} checked={Boolean(field.value)} onCheckedChange={field.onChange} />

          <label htmlFor={name} className="flex flex-col cursor-pointer select-none">
            <span className="text-[1.5rem] font-semibold text-title">{label}</span>
            {description && <span className="text-[1.3rem] text-meta">{description}</span>}
          </label>
        </div>
      )}
    />
  );
}
