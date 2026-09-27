// Utils
import { cn } from "@/utils";

type TextareaProps = React.ComponentProps<"textarea"> & { hasStartIcon?: boolean; hasEndIcon?: boolean };

export default function Textarea({ className, hasStartIcon, hasEndIcon, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-[12rem] w-full px-[1.4rem] py-[1.2rem] rounded-control border border-line bg-surface text-[1.5rem] leading-[1.6] text-title placeholder:text-muted resize-y transition-colors focus:outline-none focus:border-action aria-invalid:border-negative disabled:cursor-not-allowed disabled:opacity-50",
        hasStartIcon && "pl-[4.4rem]",
        hasEndIcon && "pr-[4.4rem]",
        className
      )}
    />
  );
}
