"use client";

// Next
import { ResponsiveContainer, Tooltip } from "recharts";

export const ChartTooltip = Tooltip;

// Recharts paints its own ticks and cursor; these selectors hand them the tokens.
export function ChartContainer({ className = "", children }: { className?: string; children: React.ReactElement }) {
  return (
    <div
      className={`text-[1.2rem] [&_.recharts-cartesian-axis-tick_text]:fill-meta [&_.recharts-curve.recharts-tooltip-cursor]:stroke-line [&_.recharts-layer]:outline-none [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none ${className}`}
    >
      <ResponsiveContainer>{children}</ResponsiveContainer>
    </div>
  );
}

type TooltipEntry = { name?: string | number; value?: number | string; color?: string; payload?: { fill?: string } };

// Recharts clones this element and fills active, payload and label itself.
export function ChartTooltipContent({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  formatter?: (value: number) => string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-[12rem] px-[1.2rem] py-[0.8rem] flex flex-col gap-[0.4rem] rounded-control border border-line bg-surface shadow-float">
      {label && <span className="text-[1.2rem] font-semibold text-title">{label}</span>}

      {payload.map((entry) => (
        <div key={String(entry.name)} className="flex items-center gap-[0.8rem] text-[1.2rem]">
          <span className="h-[0.8rem] w-[0.8rem] shrink-0 rounded-[0.2rem]" style={{ backgroundColor: entry.payload?.fill ?? entry.color }} />
          <span className="grow text-meta">{entry.name}</span>
          <span className="font-semibold text-title tabular-nums">{formatter ? formatter(Number(entry.value)) : entry.value}</span>
        </div>
      ))}
    </div>
  );
}
