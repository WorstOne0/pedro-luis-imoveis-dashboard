"use client";

// Next
import { createContext, useContext, useId } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { Controller, FormProvider, useFormContext, type ControllerProps, type FieldPath, type FieldValues } from "react-hook-form";
// Utils
import { cn } from "@/utils";

export const Form = FormProvider;

const FormFieldContext = createContext<{ name: string }>({ name: "" });
const FormItemContext = createContext<{ id: string }>({ id: "" });

export const FormField = <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ControllerProps<TFieldValues, TName>
) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

export const useFormField = () => {
  const { name } = useContext(FormFieldContext);
  const { id } = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  return { name, formItemId: `${id}-form-item`, formMessageId: `${id}-form-item-message`, ...getFieldState(name, formState) };
};

export function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div {...props} className={cn("w-full flex flex-col gap-[0.6rem]", className)} />
    </FormItemContext.Provider>
  );
}

export function FormLabel({ className, ...props }: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { error, formItemId } = useFormField();

  return <LabelPrimitive.Root {...props} htmlFor={formItemId} className={cn("text-[1.3rem] font-semibold text-body", error && "text-negative", className)} />;
}

// A Slot: it hands id and aria-* to its single child, so it must wrap the control itself.
export function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { error, formItemId, formMessageId } = useFormField();

  return <Slot {...props} id={formItemId} aria-describedby={error ? formMessageId : undefined} aria-invalid={Boolean(error)} />;
}

export function FormMessage({ className, children, ...props }: React.ComponentProps<"p">) {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error.message) : children;
  if (!body) return null;

  return (
    <p {...props} id={formMessageId} className={cn("text-[1.3rem] text-negative", className)}>
      {body}
    </p>
  );
}
