"use client";

// Next
import { useFormContext } from "react-hook-form";
// Components
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components";
import { Textarea } from "@/components/ui/textarea";
import FieldWrapper from "@/components/field_wrapper";
//
import { cn } from "@/lib/utils";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
  rows?: number;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export default function TextareaField({ name, label, placeholder = "", className, rows = 6, startIcon, endIcon }: TextareaFieldProps) {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[1.4rem] text-muted-foreground px-[0.4rem]">{label}</FormLabel>

          <FieldWrapper startIcon={startIcon} endIcon={endIcon}>
            <FormControl>
              <Textarea
                className={cn("rounded-[0.8rem]", className)}
                placeholder={placeholder}
                rows={rows}
                hasStartIcon={Boolean(startIcon)}
                hasEndIcon={Boolean(endIcon)}
                {...field}
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
