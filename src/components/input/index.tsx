// Utils
import { cn } from "@/utils";

type InputProps = React.ComponentProps<"input"> & { hasStartIcon?: boolean; hasEndIcon?: boolean };

export default function Input({ className, hasStartIcon, hasEndIcon, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "h-[4.4rem] w-full px-[1.4rem] rounded-control border border-line bg-surface text-[1.5rem] text-title placeholder:text-muted transition-colors focus:outline-none focus:border-action aria-invalid:border-negative disabled:cursor-not-allowed disabled:opacity-50",
        hasStartIcon && "pl-[4.4rem]",
        hasEndIcon && "pr-[4.4rem]",
        className
      )}
    />
  );
}
