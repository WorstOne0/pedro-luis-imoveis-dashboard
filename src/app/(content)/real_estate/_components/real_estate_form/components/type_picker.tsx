"use client";

// Next
import { Controller, useFormContext } from "react-hook-form";
// Models
import { PROPERTY_TYPES, type PropertyType } from "@/core/models";
// Utils
import { PROPERTY_GLYPHS } from "../../../_utils/property_glyphs";

// Five buttons, not a select: the options never grow, and a dropdown would hide them behind a click.
// The glyphs are the public map's pins, so a type reads the same in both apps.
export default function TypePicker({ name = "type" }: { name?: string }) {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="w-full flex flex-col gap-[0.6rem]">
          <span className="text-[1.3rem] font-semibold text-body">Tipo de imóvel</span>

          <div className="w-full grid grid-cols-3 sm:grid-cols-5 gap-[0.8rem]">
            {(Object.keys(PROPERTY_TYPES) as PropertyType[]).map((type) => {
              const isSelected = field.value === type;
              const glyph = PROPERTY_GLYPHS[type];

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => field.onChange(type)}
                  className={`h-[7.6rem] flex flex-col items-center justify-center gap-[0.6rem] rounded-control border transition-colors cursor-pointer
                    ${isSelected ? "border-action bg-action-tint text-action" : "border-line bg-surface text-soft hover:border-soft"}`}
                >
                  <svg viewBox={glyph.viewBox} className="h-[2.8rem] w-[2.8rem]" aria-hidden dangerouslySetInnerHTML={{ __html: glyph.body }} />
                  <span className={`text-[1.3rem] font-semibold ${isSelected ? "" : "text-body"}`}>{PROPERTY_TYPES[type].short}</span>
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
