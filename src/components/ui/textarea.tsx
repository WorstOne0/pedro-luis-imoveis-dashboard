import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasStartIcon?: boolean;
  hasEndIcon?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, hasStartIcon, hasEndIcon, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border border-input bg-transparent px-3 py-2 shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-[1.6rem]",
        hasStartIcon ? "pl-[4.4rem]" : "",
        hasEndIcon ? "pr-[4.4rem]" : "",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
export { Textarea };
