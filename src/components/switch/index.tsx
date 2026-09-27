"use client";

// Utils
import { cn } from "@/utils";

type SwitchProps = Omit<React.ComponentProps<"button">, "onChange"> & { checked: boolean; onCheckedChange: (checked: boolean) => void };

// A plain button, not a Radix primitive: role="switch" and aria-checked are the whole contract.
export default function Switch({ className, checked, onCheckedChange, ...props }: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "h-[2.6rem] w-[4.6rem] p-[0.3rem] shrink-0 flex items-center rounded-full transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-action" : "bg-track",
        className
      )}
    >
      <span className={`h-[2rem] w-[2rem] rounded-full bg-white shadow-float transition-transform ${checked ? "translate-x-[2rem]" : ""}`} />
    </button>
  );
}
