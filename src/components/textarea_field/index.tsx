"use client";

// Next
import { useFormContext } from "react-hook-form";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import FieldWrapper from "../field_wrapper";
import Textarea from "../textarea";

type TextareaFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export default function TextareaField({ name, label, placeholder = "", className, rows = 6, startIcon, endIcon }: TextareaFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FieldWrapper startIcon={startIcon} endIcon={endIcon}>
            <FormControl>
              <Textarea
                className={className}
                placeholder={placeholder}
                rows={rows}
                hasStartIcon={Boolean(startIcon)}
                hasEndIcon={Boolean(endIcon)}
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
          </FieldWrapper>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
