"use client";

// Components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import FieldWrapper from "../field_wrapper";
import type { SelectOption } from "../select_field";

// Radix rejects "" as an item value, so "all" travels as a sentinel and comes back as "".
const ALL = "__all__";

// For toolbars outside a <Form> (inside one, SelectField). className sizes the wrapper, the flex item a toolbar measures.
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
  return (
    <FieldWrapper startIcon={startIcon} className={className}>
      <Select value={value === "" ? ALL : value} onValueChange={(next) => onChange(next === ALL ? "" : next)}>
        <SelectTrigger className={`h-full ${startIcon ? "pl-[4.4rem]" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value || ALL} value={option.value || ALL}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
