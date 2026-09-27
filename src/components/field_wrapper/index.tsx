"use client";

// Utils
import { cn } from "@/utils";

// Sits outside FormControl, never around it: the Slot would hang the input's id and aria-* on this div.
export default function FieldWrapper({
  startIcon,
  endIcon,
  className,
  children,
}: {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // Sizing goes here, not on the control: this div is the flex item a parent measures.
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full relative", className)}>
      {startIcon && (
        <div className="h-full w-[4.4rem] flex items-center justify-center text-soft absolute top-0 left-0 pointer-events-none z-10">{startIcon}</div>
      )}

      {children}

      {endIcon && <div className="h-full w-[4.4rem] flex items-center justify-center text-soft absolute top-0 right-0 pointer-events-none z-10">{endIcon}</div>}
    </div>
  );
}
