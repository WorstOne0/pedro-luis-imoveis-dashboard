"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { FormLabel } from "@/components";
import { MdClose, MdAdd } from "react-icons/md";

/**
 * Editable list of short strings, entered one at a time. Used for a listing's
 * selling points ("Suíte master com hidro"), which appear as a checklist on the
 * public listing page.
 */
export default function TagsField({
  name,
  label,
  placeholder = "Adicionar e pressionar Enter",
  suggestions = [],
}: {
  name: string;
  label: string;
  placeholder?: string;
  suggestions?: string[];
}) {
  const { control, getValues } = useFormContext();
  const [draft, setDraft] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const tags: string[] = Array.isArray(field.value) ? field.value : [];

        // Read through getValues rather than the `tags` closure: several adds
        // in quick succession (clicking suggestions) would otherwise each start
        // from the same stale array and overwrite one another, leaving only the
        // last tag.
        const current = (): string[] => {
          const value = getValues(name);
          return Array.isArray(value) ? value : [];
        };

        const add = (value: string) => {
          const trimmed = value.trim();
          const existing = current();
          // Duplicates would render twice in the checklist for no benefit.
          if (!trimmed || existing.includes(trimmed)) return;

          field.onChange([...existing, trimmed]);
          setDraft("");
        };

        const remove = (value: string) => field.onChange(current().filter((tag) => tag !== value));

        return (
          <div className="w-full flex flex-col gap-[0.8rem]">
            <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

            <div className="w-full flex gap-[0.8rem]">
              <input
                type="text"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  // Enter would otherwise submit the surrounding form.
                  if (event.key !== "Enter") return;

                  event.preventDefault();
                  add(draft);
                }}
                placeholder={placeholder}
                className="h-[5rem] min-w-0 grow px-[1.5rem] text-[1.6rem] border border-input rounded-[0.8rem] bg-transparent focus:outline-none focus:ring-1 focus:ring-ring"
              />

              <button
                type="button"
                onClick={() => add(draft)}
                disabled={!draft.trim()}
                className="h-[5rem] w-[5rem] shrink-0 flex justify-center items-center border border-input rounded-[0.8rem] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Adicionar ${label}`}
              >
                <MdAdd size={20} />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="w-full flex flex-wrap gap-[0.6rem]">
                {tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-[0.6rem] px-[1.2rem] py-[0.6rem] rounded-full bg-primary/10 text-primary text-[1.4rem]">
                    {tag}
                    <button type="button" onClick={() => remove(tag)} aria-label={`Remover ${tag}`} className="cursor-pointer">
                      <MdClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {suggestions.filter((item) => !tags.includes(item)).length > 0 && (
              <div className="w-full flex flex-wrap gap-[0.6rem]">
                {suggestions
                  .filter((item) => !tags.includes(item))
                  .map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => add(item)}
                      className="px-[1.2rem] py-[0.5rem] rounded-full border border-dashed border-gray-300 dark:border-gray-600 text-[1.3rem] text-gray-500 hover:border-primary hover:text-primary cursor-pointer"
                    >
                      + {item}
                    </button>
                  ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}
