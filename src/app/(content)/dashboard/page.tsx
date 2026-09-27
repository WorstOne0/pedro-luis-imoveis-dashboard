/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useMemo, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, Cell, Pie, PieChart, XAxis } from "recharts";
// Models
import { PROPERTY_TYPES, type RealEstate } from "@/core/models";
// Hooks
import { useApiFetch } from "@/hooks";
// Components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components";
// Utils
import { formatCompactBRL } from "@/utils";
// Icons
import {
  MdOutlineAdd,
  MdOutlineApartment,
  MdOutlinePayments,
  MdOutlineVisibility,
  MdOutlineWhatsapp,
  MdOutlineStarBorder,
  MdOutlineEdit,
  MdOutlineAnalytics,
  MdOutlineArrowUpward,
} from "react-icons/md";

// Module scope: a `= []` default is a new array every render.
const EMPTY: RealEstate[] = [];

const MONTHS_SHOWN = 6;

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

// Marks the tiles with no real data behind them yet, so nobody reads them as numbers.
const SAMPLE_BADGE = <span className="h-[2rem] px-[0.6rem] flex items-center shrink-0 rounded-[0.4rem] bg-surface-3 text-[1.1rem] font-semibold text-meta">exemplo</span>;

export default function Dashboard() {
  const [growthMode, setGrowthMode] = useState<"count" | "value">("count");

  // The listing page's and the sidebar's SWR key, so this page adds no request.
  const { data, isLoading } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");
  const realEstateList = data ?? EMPTY;

  const stats = useMemo(() => {
    const now = new Date();
    const portfolio = realEstateList.reduce((sum, item) => sum + (item.price || 0), 0);
    const addedThisMonth = realEstateList.filter((item) => {
      const date = new Date(item.createdAt);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    // Cumulative per month, so the line only climbs: a listing stays after the month it was added.
    const months = Array.from({ length: MONTHS_SHOWN }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (MONTHS_SHOWN - 1 - index), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      const upToEnd = realEstateList.filter((item) => item.createdAt && new Date(item.createdAt) < end);

      return {
        month: date.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").replace(/^./, (char) => char.toUpperCase()),
        count: upToEnd.length,
        value: upToEnd.reduce((sum, item) => sum + (item.price || 0), 0),
      };
    });

    const countBy = (key: (item: RealEstate) => string | undefined) =>
      Object.entries(
        realEstateList.reduce<Record<string, number>>((acc, item) => {
          const value = key(item);
          if (value) acc[value] = (acc[value] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]);

    return {
      total: realEstateList.length,
      portfolio,
      addedThisMonth,
      months,
      byType: countBy((item) => item.type).map(([type, count]) => ({ type, label: PROPERTY_TYPES[type as keyof typeof PROPERTY_TYPES]?.label ?? type, count })),
      byDistrict: countBy((item) => item.address?.district).slice(0, 5),
      recent: realEstateList.slice(0, 4),
    };
  }, [realEstateList]);

  const districtMax = Math.max(...stats.byDistrict.map(([, count]) => count), 1);

  // Every listing was imported on one day, so the series is flat: recharts would draw a line pinned to the top.
  const hasGrowth = new Set(stats.months.map((month) => month[growthMode])).size > 1;

  const kpis = [
    {
      label: "Imóveis cadastrados",
      Icon: MdOutlineApartment,
      value: String(stats.total),
      hint: stats.addedThisMonth > 0 ? `+${stats.addedThisMonth} este mês` : "nenhum novo este mês",
      isUp: stats.addedThisMonth > 0,
      isHero: true,
    },
    { label: "Valor do portfólio", Icon: MdOutlinePayments, value: formatCompactBRL(stats.portfolio), hint: stats.total > 0 ? `média ${formatCompactBRL(Math.round(stats.portfolio / stats.total))}` : "—" },
    { label: "Visualizações · 30d", Icon: MdOutlineVisibility, value: "1.284", hint: "≈ 51 por imóvel", isSample: true },
    { label: "Contatos WhatsApp · 30d", Icon: MdOutlineWhatsapp, value: "96", hint: "taxa 7,5% dos acessos", isSample: true },
  ];

  const activity = [
    { Icon: MdOutlineAdd, text: "Imóvel adicionado", target: stats.recent[0]?.title ?? "—", when: "há 2 horas" },
    { Icon: MdOutlineStarBorder, text: "Marcado como destaque", target: stats.recent[1]?.title ?? "—", when: "há 5 horas" },
    { Icon: MdOutlineEdit, text: "Preço atualizado", target: stats.recent[2]?.title ?? "—", when: "ontem" },
  ];

  const buildPanelTitle = ({ title, subtitle, aside }: { title: string; subtitle?: string; aside?: React.ReactNode }) => (
    <div className="w-full mb-[1.6rem] flex items-start justify-between gap-[1rem]">
      <div className="min-w-0 flex flex-col">
        <span className="text-[1.5rem] font-bold text-title">{title}</span>
        {subtitle && <span className="text-[1.3rem] text-meta">{subtitle}</span>}
      </div>
      {aside}
    </div>
  );

  return (
    <div className="h-full w-full pb-[1rem] flex flex-col gap-[1rem] overflow-y-auto scrollbar-thin">
      <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-[1rem]">
        {kpis.map(({ label, Icon, value, hint, isUp, isHero, isSample }) => (
          <div key={label} className={`min-h-[11.2rem] px-[1.6rem] py-[1.4rem] flex flex-col justify-between gap-[0.4rem] ${isHero ? "rounded-card bg-action text-on-action" : "surface"}`}>
            <div className="flex items-center justify-between gap-[0.8rem]">
              <span className={isHero ? "text-[1.1rem] font-bold uppercase tracking-[0.06em] opacity-75" : "label"}>{label}</span>
              {isSample ? SAMPLE_BADGE : <Icon size={17} className={isHero ? "opacity-75" : "text-soft"} />}
            </div>

            <span className={`text-[2.8rem] font-bold leading-[3.4rem] tabular-nums ${isHero ? "" : "text-title"}`}>{isLoading ? "—" : value}</span>

            <span className={`flex items-center gap-[0.4rem] text-[1.3rem] ${isHero ? "" : "text-meta"} ${isUp ? "font-semibold" : ""}`}>
              {isUp && <MdOutlineArrowUpward size={14} />}
              {hint}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-[1rem]">
        <div className="min-w-0 grow flex flex-col gap-[1rem]">
          <div className="surface p-[2rem]">
            {buildPanelTitle({
              title: "Crescimento do portfólio",
              subtitle: growthMode === "count" ? "imóveis cadastrados por mês" : "valor acumulado por mês",
              aside: (
                <div className="p-[0.3rem] shrink-0 flex gap-[0.2rem] rounded-control bg-surface-3">
                  {(["count", "value"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGrowthMode(mode)}
                      className={`h-[3rem] px-[1.2rem] rounded-[0.4rem] text-[1.3rem] cursor-pointer transition-colors
                        ${growthMode === mode ? "bg-surface font-semibold text-title outline outline-line" : "text-meta hover:text-title"}`}
                    >
                      {mode === "count" ? "Quantidade" : "Valor"}
                    </button>
                  ))}
                </div>
              ),
            })}

            {!hasGrowth && (
              <div className="h-[22rem] w-full flex flex-col items-center justify-center gap-[0.4rem] rounded-control border border-dashed border-line text-center">
                <span className="text-[1.4rem] font-semibold text-title">Sem movimentação no período</span>
                <span className="text-[1.3rem] text-meta">O gráfico aparece quando houver imóveis cadastrados em meses diferentes.</span>
              </div>
            )}

            {hasGrowth && (
              <ChartContainer className="h-[22rem] w-full">
                <AreaChart data={stats.months} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                  <defs>
                    <linearGradient id="growth_fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--action)" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="var(--action)" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  {/* interval 0: recharts drops labels it guesses would collide, and lost the first month. */}
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} interval={0} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value) => (growthMode === "value" ? formatCompactBRL(value) : String(value))} />} />
                  <Area dataKey={growthMode} name={growthMode === "count" ? "Imóveis" : "Valor"} type="monotone" stroke="var(--action)" strokeWidth={2} fill="url(#growth_fill)" />
                </AreaChart>
              </ChartContainer>
            )}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
            <div className="surface p-[2rem]">
              {buildPanelTitle({ title: "Por tipo", subtitle: `${stats.byType.length} ${stats.byType.length === 1 ? "tipo" : "tipos"} no catálogo` })}

              <div className="w-full flex items-center gap-[1.6rem]">
                <ChartContainer className="h-[14rem] w-[14rem] shrink-0">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Pie data={stats.byType} dataKey="count" nameKey="label" innerRadius="60%" outerRadius="100%" paddingAngle={2} strokeWidth={0}>
                      {stats.byType.map((entry, index) => (
                        <Cell key={entry.type} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="min-w-0 grow flex flex-col gap-[0.8rem]">
                  {stats.byType.map((entry, index) => (
                    <div key={entry.type} className="flex items-center gap-[0.8rem] text-[1.4rem]">
                      <span className="h-[1rem] w-[1rem] shrink-0 rounded-[0.2rem]" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                      <span className="min-w-0 grow text-body truncate">{entry.label}</span>
                      <span className="font-semibold text-title tabular-nums">{entry.count}</span>
                    </div>
                  ))}
                  {stats.byType.length === 0 && <span className="text-[1.4rem] text-meta">Sem dados</span>}
                </div>
              </div>
            </div>

            <div className="surface p-[2rem]">
              {buildPanelTitle({ title: "Por bairro", subtitle: `top ${stats.byDistrict.length}` })}

              <div className="w-full flex flex-col gap-[1.2rem]">
                {stats.byDistrict.map(([district, count]) => (
                  <div key={district} className="w-full flex flex-col gap-[0.5rem]">
                    <div className="w-full flex items-baseline justify-between gap-[1rem] text-[1.4rem]">
                      <span className="min-w-0 font-semibold text-title truncate">{district}</span>
                      <span className="shrink-0 font-semibold text-title tabular-nums">{count}</span>
                    </div>

                    <div className="h-[0.3rem] w-full rounded-full bg-track">
                      <div className="h-full rounded-full bg-action" style={{ width: `${Math.max((count / districtMax) * 100, 3)}%` }} />
                    </div>
                  </div>
                ))}
                {stats.byDistrict.length === 0 && <span className="text-[1.4rem] text-meta">Sem dados</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[36rem] shrink-0 flex flex-col gap-[1rem]">
          <div className="surface p-[2rem]">
            {buildPanelTitle({ title: "Ações rápidas" })}

            <div className="w-full flex flex-col gap-[0.8rem]">
              <Link
                href="/real_estate/add"
                className="h-[4.4rem] w-full flex items-center justify-center gap-[0.8rem] rounded-control bg-action text-[1.5rem] font-semibold text-on-action hover:bg-action-hover"
              >
                <MdOutlineAdd size={20} />
                Adicionar imóvel
              </Link>

              <div className="w-full grid grid-cols-2 gap-[0.8rem]">
                <Link
                  href="/real_estate?featured=true"
                  className="h-[4.2rem] flex items-center justify-center gap-[0.8rem] rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2"
                >
                  <MdOutlineStarBorder size={18} />
                  Destaques
                </Link>
                <Link
                  href="/analytics"
                  className="h-[4.2rem] flex items-center justify-center gap-[0.8rem] rounded-control border border-line bg-surface text-[1.4rem] font-semibold text-title hover:bg-surface-2"
                >
                  <MdOutlineAnalytics size={18} />
                  Análises
                </Link>
              </div>
            </div>
          </div>

          <div className="surface p-[2rem]">
            {buildPanelTitle({
              title: "Adicionados recentemente",
              aside: (
                <Link href="/real_estate" className="shrink-0 text-[1.3rem] font-semibold text-action hover:underline">
                  Ver todos ›
                </Link>
              ),
            })}

            <div className="w-full flex flex-col gap-[1.2rem]">
              {stats.recent.map((item) => (
                <Link key={item._id} href={`/real_estate/edit/${item._id}`} className="w-full flex items-center gap-[1.2rem] group">
                  <span className="h-[4.4rem] w-[4.4rem] shrink-0 rounded-control bg-surface-3 overflow-hidden">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />}
                  </span>

                  <span className="min-w-0 grow flex flex-col">
                    <span className="text-[1.4rem] font-semibold text-title truncate group-hover:text-action">{item.title}</span>
                    <span className="text-[1.2rem] text-meta truncate">
                      {PROPERTY_TYPES[item.type]?.label ?? "Imóvel"} · {item.address?.district}
                    </span>
                  </span>

                  <span className="shrink-0 text-[1.4rem] font-semibold text-title tabular-nums">{formatCompactBRL(item.price)}</span>
                </Link>
              ))}

              {!isLoading && stats.recent.length === 0 && <span className="text-[1.4rem] text-meta">Nenhum imóvel cadastrado.</span>}
            </div>
          </div>

          <div className="surface p-[2rem]">
            {buildPanelTitle({ title: "Atividade", aside: SAMPLE_BADGE })}

            <div className="w-full flex flex-col gap-[1.4rem]">
              {activity.map(({ Icon, text, target, when }) => (
                <div key={text} className="w-full flex items-start gap-[1.2rem]">
                  <span className="h-[3.2rem] w-[3.2rem] shrink-0 flex items-center justify-center rounded-control bg-surface-3 text-soft">
                    <Icon size={16} />
                  </span>

                  <span className="min-w-0 grow flex flex-col">
                    <span className="text-[1.4rem] text-body truncate">
                      {text} — <span className="font-semibold text-title">{target}</span>
                    </span>
                    <span className="text-[1.2rem] text-meta">{when}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
