"use client";

// Next
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
// Icons
import { MdOutlineAdd, MdOutlineClose } from "react-icons/md";

// A listing's selling points, one at a time; the public page shows them as a checklist.
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
        const offered = suggestions.filter((item) => !tags.includes(item));

        // From getValues, not the `tags` closure: quick successive adds would each start from the same stale array.
        const current = (): string[] => {
          const value = getValues(name);
          return Array.isArray(value) ? value : [];
        };

        const add = (value: string) => {
          const trimmed = value.trim();
          if (!trimmed || current().includes(trimmed)) return;

          field.onChange([...current(), trimmed]);
          setDraft("");
        };

        return (
          <div className="w-full flex flex-col gap-[0.6rem]">
            <span className="text-[1.3rem] font-semibold text-body">{label}</span>

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
                className="h-[4.4rem] min-w-0 grow px-[1.4rem] rounded-control border border-line bg-surface text-[1.5rem] text-title placeholder:text-muted focus:outline-none focus:border-action"
              />

              <button
                type="button"
                aria-label={`Adicionar ${label}`}
                onClick={() => add(draft)}
                disabled={!draft.trim()}
                className="h-[4.4rem] w-[4.4rem] shrink-0 flex items-center justify-center rounded-control border border-line bg-surface text-body hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <MdOutlineAdd size={20} />
              </button>
            </div>

            {tags.length > 0 && (
              <div className="w-full mt-[0.4rem] flex flex-wrap gap-[0.6rem]">
                {tags.map((tag) => (
                  <span key={tag} className="h-[3rem] pl-[1.2rem] pr-[0.8rem] flex items-center gap-[0.6rem] rounded-full bg-action-tint text-[1.3rem] font-semibold text-action">
                    {tag}
                    <button type="button" aria-label={`Remover ${tag}`} onClick={() => field.onChange(current().filter((item) => item !== tag))} className="cursor-pointer">
                      <MdOutlineClose size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {offered.length > 0 && (
              <div className="w-full mt-[0.4rem] flex flex-wrap gap-[0.6rem]">
                {offered.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => add(item)}
                    className="h-[3rem] px-[1.2rem] rounded-full border border-dashed border-line text-[1.3rem] text-meta hover:border-action hover:text-action cursor-pointer"
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
