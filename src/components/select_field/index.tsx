"use client";

// Next
import { useFormContext } from "react-hook-form";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../select";
import FieldWrapper from "../field_wrapper";

export type SelectOption = { value: string; label: string };

export default function SelectField({
  name,
  label,
  options,
  placeholder = "Selecione",
  startIcon,
}: {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  startIcon?: React.ReactNode;
}) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FieldWrapper startIcon={startIcon}>
            {/* value, not defaultValue: a form reset or a loaded record has to show up. */}
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                <SelectTrigger className={startIcon ? "pl-[4.4rem]" : ""}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
