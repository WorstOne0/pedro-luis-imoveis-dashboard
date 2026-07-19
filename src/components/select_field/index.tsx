"use client";

// Next
import { useFormContext } from "react-hook-form";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import FieldWrapper from "@/components/field_wrapper";
//
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

interface SelectFieldProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  startIcon?: React.ReactNode;
}

export default function SelectField({ name, label, options, placeholder = "Selecione", className, startIcon }: SelectFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

          <FieldWrapper startIcon={startIcon}>
            {/* value (not defaultValue) so resetting the form or loading an
                existing record actually updates what is shown. */}
            <Select onValueChange={field.onChange} value={field.value ?? ""}>
              <FormControl>
                {/* w-full is required: shadcn's SelectTrigger ships w-fit, so
                    without it the select shrinks to its content and no longer
                    lines up with the inputs beside it. */}
                <SelectTrigger className={cn("h-[5rem] w-full text-[1.6rem] rounded-[0.8rem]", startIcon ? "pl-[4.4rem]" : "", className)}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[1.6rem] py-[1.1rem] pl-[3.2rem] pr-[1.2rem] cursor-pointer">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FormMessage className="text-[1.4rem] px-[0.4rem]" />
        </FormItem>
      )}
    />
  );
}
