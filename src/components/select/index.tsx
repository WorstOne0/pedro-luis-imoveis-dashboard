"use client";

// Next
import * as SelectPrimitive from "@radix-ui/react-select";
// Utils
import { cn } from "@/utils";
// Icons
import { MdOutlineCheck, MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from "react-icons/md";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      {...props}
      className={cn(
        "h-[4.4rem] w-full px-[1.4rem] flex items-center justify-between gap-[0.8rem] rounded-control border border-line bg-surface text-[1.5rem] text-title whitespace-nowrap transition-colors cursor-pointer focus:outline-none focus:border-action data-[placeholder]:text-muted aria-invalid:border-negative disabled:cursor-not-allowed disabled:opacity-50 [&>span]:truncate",
        className
      )}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <MdOutlineKeyboardArrowDown size={18} className="shrink-0 text-soft" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        {...props}
        position={position}
        className={cn(
          "max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) p-[0.4rem] rounded-card border border-line bg-surface shadow-float overflow-hidden relative z-50",
          position === "popper" && "data-[side=bottom]:translate-y-[0.4rem] data-[side=top]:-translate-y-[0.4rem]",
          className
        )}
      >
        <SelectPrimitive.ScrollUpButton className="h-[2.4rem] flex items-center justify-center text-meta">
          <MdOutlineKeyboardArrowUp size={18} />
        </SelectPrimitive.ScrollUpButton>

        <SelectPrimitive.Viewport className="w-full">{children}</SelectPrimitive.Viewport>

        <SelectPrimitive.ScrollDownButton className="h-[2.4rem] flex items-center justify-center text-meta">
          <MdOutlineKeyboardArrowDown size={18} />
        </SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      {...props}
      className={cn(
        "min-h-[3.6rem] pl-[1rem] pr-[3.2rem] flex items-center rounded-control text-[1.4rem] text-body outline-none select-none cursor-pointer relative data-[highlighted]:bg-surface-2 data-[highlighted]:text-title data-[state=checked]:font-semibold data-[state=checked]:text-title data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

      <SelectPrimitive.ItemIndicator className="absolute right-[1rem] text-action">
        <MdOutlineCheck size={16} />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}
