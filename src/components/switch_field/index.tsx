"use client";

import { useFormContext, Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";

/**
 * Boolean toggle bound to a form field.
 *
 * `reverse` puts the label first and the switch at the far right, which is what
 * a full-width settings row wants; the default keeps them side by side.
 */
export default function SwitchField({
  name,
  label,
  description,
  reverse = false,
}: {
  name: string;
  label: string;
  description?: string;
  reverse?: boolean;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className={`w-full flex items-center gap-[1.2rem] ${reverse ? "flex-row-reverse justify-between" : ""}`}>
          <Switch id={name} checked={Boolean(field.value)} onCheckedChange={field.onChange} />

          <label htmlFor={name} className="flex flex-col cursor-pointer select-none">
            <span className="text-[1.6rem] font-semibold">{label}</span>
            {description && <span className="text-[1.3rem] text-muted-foreground">{description}</span>}
          </label>
        </div>
      )}
    />
  );
}
