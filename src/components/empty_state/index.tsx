// Next
import type { IconType } from "react-icons";

// An icon in a well, a title, one line, and — when there is one — the way out.
export default function EmptyState({
  Icon,
  title,
  subtitle,
  action,
  className = "",
}: {
  Icon: IconType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`py-[4rem] flex flex-col items-center justify-center gap-[1.2rem] text-center ${className}`}>
      <span className="h-[5.2rem] w-[5.2rem] flex items-center justify-center rounded-full bg-surface-3 text-soft">
        <Icon size={24} />
      </span>

      <div className="flex flex-col gap-[0.2rem]">
        <span className="text-[1.5rem] font-bold text-title">{title}</span>
        {subtitle && <span className="max-w-[44rem] text-[1.3rem] text-meta">{subtitle}</span>}
      </div>

      {action}
    </div>
  );
}
