"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FieldWrapper from "@/components/field_wrapper";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/components/select_field";

/**
 * Select for use outside a react-hook-form context (filter bars, toolbars).
 * SelectField is the one to use inside a <Form>.
 */
export default function SelectPlain({
  value,
  onChange,
  options,
  placeholder = "Selecione",
  className,
  startIcon,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  startIcon?: React.ReactNode;
}) {
  // Radix rejects an empty string as an item value, so the "all" option is
  // carried as a sentinel and mapped back to "" for the caller.
  const ALL = "__all__";

  // Sizing goes on the wrapper — it is the flex item a toolbar measures. Left
  // on the trigger it had no effect, and the wrapper's default w-full let each
  // select claim an equal share of the row.
  return (
    <FieldWrapper startIcon={startIcon} className={className}>
      <Select value={value === "" ? ALL : value} onValueChange={(next) => onChange(next === ALL ? "" : next)}>
        {/* w-full is required: shadcn's SelectTrigger ships w-fit. */}
        <SelectTrigger className={cn("h-full w-full text-[1.6rem] rounded-[1rem]", startIcon ? "pl-[4.4rem]" : "")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value || ALL}
              value={option.value || ALL}
              className="text-[1.6rem] py-[1.1rem] pl-[3.2rem] pr-[1.2rem] cursor-pointer"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
