"use client";

// Next
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import FieldWrapper from "../field_wrapper";
import Input from "../input";

type InputFieldProps = {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
};

export default function InputField({ name, label, type = "text", placeholder = "", className, autoFocus = false, startIcon, endIcon }: InputFieldProps) {
  const { control, setFocus } = useFormContext();

  useEffect(() => {
    if (autoFocus) setFocus(name);
  }, [autoFocus, name, setFocus]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>

          <FieldWrapper startIcon={startIcon} endIcon={endIcon}>
            <FormControl>
              <Input
                className={className}
                type={type}
                placeholder={placeholder}
                hasStartIcon={Boolean(startIcon)}
                hasEndIcon={Boolean(endIcon)}
                {...field}
                // A number input hands back a string; coerced here so the form value keeps its type.
                onChange={(event) => field.onChange(type === "number" ? event.target.valueAsNumber : event.target.value)}
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
