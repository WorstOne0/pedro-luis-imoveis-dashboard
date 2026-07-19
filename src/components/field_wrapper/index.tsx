"use client";

import { cn } from "@/lib/utils";

/**
 * Positions optional prefix/suffix icons over a form control.
 *
 * Must sit *outside* FormControl, never around it: FormControl is a Radix Slot
 * that forwards id/aria-* onto its single child, so wrapping it here would hang
 * those attributes on this div instead of on the real input.
 */
export default function FieldWrapper({
  startIcon,
  endIcon,
  className,
  children,
}: {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  // Sizing belongs here, not on the control: this div is what a flex parent
  // measures, so a width left on the inner control is ignored and the wrapper
  // keeps its default w-full.
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full relative", className)}>
      {startIcon && (
        <div className="h-full w-[4rem] top-0 left-0 absolute flex justify-center items-center text-gray-500 pointer-events-none z-10">{startIcon}</div>
      )}

      {children}

      {endIcon && (
        <div className="h-full w-[4rem] top-0 right-0 absolute flex justify-center items-center text-gray-500 pointer-events-none z-10">{endIcon}</div>
      )}
    </div>
  );
}
