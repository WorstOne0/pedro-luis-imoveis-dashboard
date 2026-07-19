"use client";

// Next
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components";
import FieldWrapper from "@/components/field_wrapper";
//
import { cn } from "@/lib/utils";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function InputField({
  name,
  label,
  type = "text",
  placeholder = "",
  className,
  autoFocus = false,
  startIcon,
  endIcon,
}: InputFieldProps) {
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
          <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

          <FieldWrapper startIcon={startIcon} endIcon={endIcon}>
            <FormControl>
              <Input
                // Height lives here rather than at every call site. The login
                // page passed no className and so rendered noticeably smaller
                // inputs than the rest of the app.
                className={cn("h-[5rem] md:text-[1.6rem] rounded-[0.8rem]", className)}
                type={type}
                placeholder={placeholder}
                hasStartIcon={Boolean(startIcon)}
                hasEndIcon={Boolean(endIcon)}
                {...field}
                // A number input hands back a string; coerce so zod does not
                // have to and the form value stays the right type.
                onChange={(event) => field.onChange(type === "number" ? event.target.valueAsNumber : event.target.value)}
                value={field.value ?? ""}
              />
            </FormControl>
          </FieldWrapper>

          <FormMessage className="text-[1.4rem] px-[0.4rem]" />
        </FormItem>
      )}
    />
  );
}
