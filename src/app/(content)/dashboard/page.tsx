/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useMemo, useState } from "react";
import Link from "next/link";
import { Area, AreaChart, Cell, Pie, PieChart, XAxis } from "recharts";
// Components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components";
// Hooks / Data
import { useApiFetch } from "@/hooks";
import { propertyTypeLabel } from "@/lib/real_estate_options";
import type { RealEstate } from "@/store/useRealEstateStore";
// Icons
import { IoAdd } from "react-icons/io5";
import { MdOutlineHomeWork, MdOutlineStarBorder, MdOutlineEdit, MdOutlineAnalytics, MdOutlineVisibility } from "react-icons/md";
import { FaWhatsapp, FaDollarSign } from "react-icons/fa6";

// Blue ramp, darkest first — the donut reads as one family rather than five
// unrelated hues.
const PALETTE = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#c7dcfd"];

const MONTHS_SHOWN = 6;

const formatCompactBRL = (value: number) => {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (value >= 1_000) return `R$ ${Math.round(value / 1_000)}k`;

  return `R$ ${value}`;
};

const Panel = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`bg-card border border-border rounded-[1.6rem] p-[2rem] ${className}`}>{children}</div>
);

const PanelTitle = ({ title, subtitle, aside }: { title: string; subtitle?: string; aside?: React.ReactNode }) => (
  <div className="w-full flex items-start justify-between gap-[1rem] mb-[1.6rem]">
    <div className="flex flex-col">
      <span className="text-[1.8rem] font-bold leading-[2.2rem]">{title}</span>
      {subtitle && <span className="text-[1.3rem] text-muted-foreground">{subtitle}</span>}
    </div>
    {aside}
  </div>
);

/** Marks the two cards we cannot populate yet, so nobody reads them as real. */
const SampleBadge = () => (
  <span className="text-[1.1rem] px-[0.6rem] py-[0.2rem] rounded-[0.5rem] bg-muted text-muted-foreground shrink-0">exemplo</span>
);

export default function Dashboard() {
  const [growthMode, setGrowthMode] = useState<"count" | "value">("count");

  // Same SWR key as the listing page and the sidebar badge, so this page adds
  // no request of its own.
  const { data: realEstateList = [], isLoading } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");

  const stats = useMemo(() => {
    const total = realEstateList.length;
    const portfolio = realEstateList.reduce((sum, item) => sum + (item.price || 0), 0);

    const now = new Date();
    const addedThisMonth = realEstateList.filter((item) => {
      if (!item.createdAt) return false;
      const date = new Date(item.createdAt);

      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    // Cumulative totals per month, so the line only ever climbs — a listing
    // stays in the portfolio after the month it was added.
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

    const byType = Object.entries(
      realEstateList.reduce<Record<string, number>>((acc, item) => {
        if (item.type) acc[item.type] = (acc[item.type] ?? 0) + 1;
        return acc;
      }, {})
    )
      .map(([type, count]) => ({ type, label: propertyTypeLabel(type), count }))
      .sort((a, b) => b.count - a.count);

    const byDistrict = Object.entries(
      realEstateList.reduce<Record<string, number>>((acc, item) => {
        const district = item.address?.district;
        if (district) acc[district] = (acc[district] ?? 0) + 1;
        return acc;
      }, {})
    )
      .map(([district, count]) => ({ district, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const recent = [...realEstateList]
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 4);

    return { total, portfolio, addedThisMonth, months, byType, byDistrict, recent };
  }, [realEstateList]);

  const districtMax = Math.max(...stats.byDistrict.map((item) => item.count), 1);

  // The whole catalogue was imported on one day, so within a six-month window
  // the cumulative series never moves. recharts still draws that — a flat line
  // pinned to the top of the panel, which reads as a broken chart rather than
  // as "nothing happened". Say it in words instead.
  const hasGrowth = new Set(stats.months.map((month) => month[growthMode])).size > 1;

  const cards = [
    {
      label: "Imóveis cadastrados",
      icon: MdOutlineHomeWork,
      value: String(stats.total),
      hint: stats.addedThisMonth > 0 ? `+${stats.addedThisMonth} este mês` : "nenhum novo este mês",
      isPositive: stats.addedThisMonth > 0,
    },
    {
      label: "Valor do portfólio",
      icon: FaDollarSign,
      value: formatCompactBRL(stats.portfolio),
      hint: stats.total > 0 ? `média ${formatCompactBRL(Math.round(stats.portfolio / stats.total))}` : "—",
    },
    { label: "Visualizações · 30d", icon: MdOutlineVisibility, value: "1.284", hint: "≈ 51 por imóvel", isSample: true },
    { label: "Contatos WhatsApp · 30d", icon: FaWhatsapp, value: "96", hint: "taxa 7,5% dos acessos", isSample: true },
  ];

  const activity = [
    { icon: IoAdd, text: "Imóvel adicionado", target: stats.recent[0]?.title ?? "—", when: "há 2 horas" },
    { icon: MdOutlineStarBorder, text: "Marcado como destaque", target: stats.recent[1]?.title ?? "—", when: "há 5 horas" },
    { icon: MdOutlineEdit, text: "Preço atualizado", target: stats.recent[2]?.title ?? "—", when: "ontem" },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-[1.2rem] overflow-y-auto pb-[1rem]">
      {/* Stat cards */}
      <div className="w-full grid grid-cols-2 xl:grid-cols-4 gap-[1.2rem]">
        {cards.map((card) => (
          <Panel key={card.label} className="flex flex-col">
            <div className="w-full flex items-start justify-between gap-[1rem]">
              <span className="text-[1.4rem] text-muted-foreground">{card.label}</span>
              {card.isSample ? <SampleBadge /> : <card.icon size={16} className="text-muted-foreground shrink-0 mt-[0.3rem]" />}
            </div>

            <span className="text-[3.6rem] font-bold leading-[4.4rem] mt-[0.8rem]">{isLoading ? "—" : card.value}</span>

            <span className={`text-[1.3rem] ${card.isPositive ? "text-emerald-600 font-semibold" : "text-muted-foreground"}`}>{card.hint}</span>
          </Panel>
        ))}
      </div>

      <div className="w-full flex flex-col xl:flex-row gap-[1.2rem]">
        {/* Left column */}
        <div className="min-w-0 grow flex flex-col gap-[1.2rem]">
          <Panel>
            <PanelTitle
              title="Crescimento do portfólio"
              subtitle={growthMode === "count" ? "imóveis cadastrados por mês" : "valor acumulado por mês"}
              aside={
                <div className="flex items-center rounded-[0.8rem] bg-muted p-[0.3rem] shrink-0">
                  {(["count", "value"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setGrowthMode(mode)}
                      className={`h-[3.2rem] px-[1.4rem] rounded-[0.6rem] text-[1.3rem] cursor-pointer transition-colors
                        ${growthMode === mode ? "bg-card font-semibold shadow-sm" : "text-muted-foreground"}`}
                    >
                      {mode === "count" ? "Qtd." : "Valor"}
                    </button>
                  ))}
                </div>
              }
            />

            {!hasGrowth ? (
              <div className="h-[22rem] w-full flex flex-col justify-center items-center gap-[0.6rem] rounded-[1rem] border border-dashed border-border">
                <span className="text-[1.5rem] font-semibold text-muted-foreground">Sem movimentação no período</span>
                <span className="text-[1.3rem] text-muted-foreground">O gráfico aparece assim que houver imóveis cadastrados em meses diferentes.</span>
              </div>
            ) : (
            <ChartContainer config={{ [growthMode]: { label: growthMode === "count" ? "Imóveis" : "Valor", color: "#2563eb" } }} className="h-[22rem] w-full">
              <AreaChart data={stats.months} margin={{ top: 10, right: 10, bottom: 0, left: 10 }}>
                <defs>
                  <linearGradient id="growth_fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>

                {/* interval={0}: recharts drops labels it thinks would collide,
                    and six months across this width lost the first one. */}
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} interval={0} className="text-[1.2rem]" />
                <ChartTooltip
                  content={<ChartTooltipContent formatter={(value) => (growthMode === "value" ? formatCompactBRL(Number(value)) : String(value))} />}
                />

                <Area dataKey={growthMode} type="monotone" stroke="#2563eb" strokeWidth={2} fill="url(#growth_fill)" />
              </AreaChart>
            </ChartContainer>
            )}
          </Panel>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[1.2rem]">
            <Panel>
              <PanelTitle title="Por tipo" />

              <div className="w-full flex items-center gap-[1.5rem]">
                <ChartContainer config={{ count: { label: "Imóveis" } }} className="h-[14rem] w-[14rem] shrink-0">
                  <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                    <Pie data={stats.byType} dataKey="count" nameKey="label" innerRadius="58%" outerRadius="100%" paddingAngle={2} strokeWidth={0}>
                      {stats.byType.map((entry, index) => (
                        <Cell key={entry.type} fill={PALETTE[index % PALETTE.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="min-w-0 grow flex flex-col gap-[0.6rem]">
                  {stats.byType.map((entry, index) => (
                    <div key={entry.type} className="flex items-center gap-[0.8rem]">
                      <span className="h-[1rem] w-[1rem] rounded-[0.3rem] shrink-0" style={{ backgroundColor: PALETTE[index % PALETTE.length] }} />
                      <span className="min-w-0 grow text-[1.4rem] truncate">{entry.label}</span>
                      <span className="text-[1.4rem] text-muted-foreground">{entry.count}</span>
                    </div>
                  ))}
                  {stats.byType.length === 0 && <span className="text-[1.4rem] italic text-muted-foreground">Sem dados</span>}
                </div>
              </div>
            </Panel>

            <Panel>
              <PanelTitle title="Por bairro" />

              <div className="w-full flex flex-col gap-[1.2rem]">
                {stats.byDistrict.map((entry) => (
                  <div key={entry.district} className="w-full flex flex-col gap-[0.5rem]">
                    <div className="w-full flex items-baseline justify-between gap-[1rem]">
                      <span className="min-w-0 text-[1.4rem] truncate">{entry.district}</span>
                      <span className="text-[1.4rem] text-muted-foreground shrink-0">{entry.count}</span>
                    </div>
                    <div className="h-[0.6rem] w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(entry.count / districtMax) * 100}%` }} />
                    </div>
                  </div>
                ))}
                {stats.byDistrict.length === 0 && <span className="text-[1.4rem] italic text-muted-foreground">Sem dados</span>}
              </div>
            </Panel>
          </div>
        </div>

        {/* Right column */}
        <div className="w-full xl:w-[38rem] shrink-0 flex flex-col gap-[1.2rem]">
          <Panel>
            <PanelTitle title="Ações rápidas" />

            <div className="w-full flex flex-col gap-[1rem]">
              <Link
                href="/real_estate/add"
                className="h-[5rem] w-full flex justify-center items-center gap-[0.8rem] rounded-[1rem] bg-primary text-white font-semibold text-[1.6rem] hover:opacity-90"
              >
                <IoAdd size={20} />
                Adicionar imóvel
              </Link>

              <div className="w-full grid grid-cols-2 gap-[1rem]">
                <Link
                  href="/real_estate?featured=true"
                  className="h-[4.6rem] flex justify-center items-center gap-[0.8rem] rounded-[1rem] border border-border text-[1.4rem] hover:bg-muted"
                >
                  <MdOutlineStarBorder size={18} />
                  Destaques
                </Link>
                <Link
                  href="/analytics"
                  className="h-[4.6rem] flex justify-center items-center gap-[0.8rem] rounded-[1rem] border border-border text-[1.4rem] hover:bg-muted"
                >
                  <MdOutlineAnalytics size={18} />
                  Análises
                </Link>
              </div>
            </div>
          </Panel>

          <Panel>
            <PanelTitle
              title="Adicionados recentemente"
              aside={
                <Link href="/real_estate" className="text-[1.3rem] text-primary hover:underline shrink-0 mt-[0.4rem]">
                  Ver todos
                </Link>
              }
            />

            <div className="w-full flex flex-col gap-[1.2rem]">
              {stats.recent.map((item) => (
                <Link key={item._id} href={`/real_estate/edit/${item._id}`} className="w-full flex items-center gap-[1.2rem] group">
                  <div className="h-[4.8rem] w-[4.8rem] shrink-0 rounded-[0.8rem] bg-muted overflow-hidden">
                    {item.thumbnail && <img src={item.thumbnail} alt="" className="h-full w-full object-cover" />}
                  </div>

                  <div className="min-w-0 grow flex flex-col">
                    <span className="text-[1.4rem] font-semibold truncate group-hover:text-primary">{item.title}</span>
                    <span className="text-[1.2rem] text-muted-foreground truncate">
                      {propertyTypeLabel(item.type)} · {item.address?.district}
                    </span>
                  </div>

                  <span className="text-[1.4rem] font-semibold shrink-0">{formatCompactBRL(item.price)}</span>
                </Link>
              ))}

              {!isLoading && stats.recent.length === 0 && <span className="text-[1.4rem] italic text-muted-foreground">Nenhum imóvel cadastrado.</span>}
            </div>
          </Panel>

          <Panel>
            <PanelTitle title="Atividade" aside={<SampleBadge />} />

            <div className="w-full flex flex-col gap-[1.4rem]">
              {activity.map((entry) => (
                <div key={entry.text} className="w-full flex items-start gap-[1.2rem]">
                  <div className="h-[3.2rem] w-[3.2rem] shrink-0 rounded-[0.8rem] bg-muted flex justify-center items-center text-muted-foreground">
                    <entry.icon size={16} />
                  </div>

                  <div className="min-w-0 grow flex flex-col">
                    <span className="text-[1.4rem] truncate">
                      {entry.text} — <span className="font-semibold">{entry.target}</span>
                    </span>
                    <span className="text-[1.2rem] text-muted-foreground">{entry.when}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
