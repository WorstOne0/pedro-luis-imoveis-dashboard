/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import { useMemo } from "react";
import Link from "next/link";
import type { IconType } from "react-icons";
import { Area, Bar, BarChart, CartesianGrid, Cell, ComposedChart, LabelList, Line, Pie, PieChart, XAxis, YAxis } from "recharts";
// Models
import { PROPERTY_TYPES, hasRealPosition, realEstateTitle, type PropertyType, type RealEstate } from "@/core/models";
// Hooks
import { useApiFetch } from "@/hooks";
// Components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components";
// Icons
import {
  MdOutlineApartment,
  MdOutlineArrowUpward,
  MdOutlineBathtub,
  MdOutlineBed,
  MdOutlineDirectionsCar,
  MdOutlineMap,
  MdOutlinePayments,
  MdOutlinePhotoLibrary,
  MdOutlinePlace,
  MdOutlineSell,
  MdOutlineSquareFoot,
  MdOutlineStarBorder,
  MdOutlineWarningAmber,
} from "react-icons/md";

// Module scope: a `= []` default is a new array every render.
const EMPTY: RealEstate[] = [];

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

// Upper bounds, exclusive. Uneven on purpose: listings are priced in these steps, not in equal bins.
const PRICE_BRACKETS = [
  { label: "até 300 mil", max: 300_000 },
  { label: "300–400 mil", max: 400_000 },
  { label: "400–600 mil", max: 600_000 },
  { label: "600–800 mil", max: 800_000 },
  { label: "800 mil–1 mi", max: 1_000_000 },
  { label: "1–1,5 mi", max: 1_500_000 },
  { label: "1,5–2 mi", max: 2_000_000 },
  { label: "2 mi+", max: Infinity },
];

const AREA_BRACKETS = [
  { label: "até 100", max: 100 },
  { label: "100–250", max: 250 },
  { label: "250–500", max: 500 },
  { label: "500+", max: Infinity },
];

const TOP_COUNT = 3;
const MIN_PHOTOS = 5;

const DOT = { r: 3.5, fill: "var(--surface)", strokeWidth: 1.6 };

type Tile = { label: string; Icon: IconType; value: string; prefix?: string; unit?: string; hint: string; tone?: "up" | "attention"; isHero?: boolean };

// 21_066_807 → { value: "21,1", unit: "mi" }: the number and its unit are set in different sizes.
const splitBRL = (value: number) => {
  if (value >= 1_000_000) return { value: (value / 1_000_000).toFixed(1).replace(".", ",").replace(/,0$/, ""), unit: "mi" };
  if (value >= 1_000) return { value: String(Math.round(value / 1_000)), unit: "mil" };

  return { value: value.toLocaleString("pt-BR"), unit: "" };
};

const shortBRL = (value: number) => {
  const { value: number, unit } = splitBRL(value);

  return unit ? `${number} ${unit}` : number;
};

const average = (values: number[]) => (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0);

const formatDecimal = (value: number) => value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

const percentOf = (part: number, total: number) => (total ? Math.round((part / total) * 100) : 0);

export default function Dashboard() {
  // The listing page's and the sidebar's SWR key, so this page adds no request.
  const { data, isLoading } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");
  const realEstateList = data ?? EMPTY;

  const stats = useMemo(() => {
    const now = new Date();
    const priced = realEstateList.filter((item) => item.price > 0);
    const portfolio = priced.reduce((sum, item) => sum + item.price, 0);
    const pricePerMeter = priced
      .filter((item) => item.area > 0)
      .map((item) => item.price / item.area)
      .sort((a, b) => a - b);
    const areas = realEstateList.map((item) => item.area).filter((area) => area > 0);
    const photos = realEstateList.map((item) => item.images?.length ?? 0);

    const countBy = (key: (item: RealEstate) => string | undefined) =>
      Object.entries(
        realEstateList.reduce<Record<string, number>>((acc, item) => {
          const value = key(item);
          if (value) acc[value] = (acc[value] ?? 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]);

    const bracket = <T,>(brackets: { label: string; max: number }[], items: T[], read: (item: T) => number) =>
      brackets.map(({ label, max }, index) => {
        const min = brackets[index - 1]?.max ?? 0;
        const inside = items.filter((item) => read(item) >= min && read(item) < max);

        return { label, count: inside.length, value: inside.reduce((sum, item) => sum + read(item), 0) };
      });

    // One bucket per listing: the most serious gap wins.
    const quality = { complete: 0, attention: 0, offMap: 0 };
    realEstateList.forEach((item) => {
      if (!hasRealPosition(item)) quality.offMap++;
      else if (item.price <= 0 || (item.images?.length ?? 0) < MIN_PHOTOS) quality.attention++;
      else quality.complete++;
    });

    return {
      total: realEstateList.length,
      unpriced: realEstateList.length - priced.length,
      portfolio,
      averagePrice: priced.length ? portfolio / priced.length : 0,
      medianPricePerMeter: pricePerMeter[Math.floor(pricePerMeter.length / 2)] ?? 0,
      pricePerMeterCount: pricePerMeter.length,
      averageArea: average(areas),
      areaRange: areas.length ? `de ${Math.min(...areas)} a ${Math.max(...areas)} m²` : "sem dados",
      onMap: realEstateList.filter(hasRealPosition).length,
      addedThisMonth: realEstateList.filter((item) => {
        const date = new Date(item.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      }).length,
      featured: realEstateList.filter((item) => item.featured).length,
      averagePhotos: average(photos),
      fewPhotos: photos.filter((count) => count < MIN_PHOTOS).length,
      rooms: realEstateList.map((item) => item.rooms).filter((value) => value > 0),
      bathrooms: realEstateList.map((item) => item.bathrooms).filter((value) => value > 0),
      garages: realEstateList.map((item) => item.garages).filter((value) => value > 0),
      priceBrackets: bracket(PRICE_BRACKETS, priced, (item) => item.price),
      areaBrackets: bracket(AREA_BRACKETS, areas, (area) => area),
      byType: (Object.keys(PROPERTY_TYPES) as PropertyType[])
        .map((type) => ({ type, label: PROPERTY_TYPES[type].label, count: realEstateList.filter((item) => item.type === type).length }))
        .sort((a, b) => b.count - a.count),
      byDistrict: countBy((item) => item.address?.district),
      mostValuable: [...priced].sort((a, b) => b.price - a.price).slice(0, TOP_COUNT),
      recent: realEstateList.slice(0, TOP_COUNT),
      quality,
    };
  }, [realEstateList]);

  const portfolio = splitBRL(stats.portfolio);
  const offMap = stats.total - stats.onMap;
  const topDistrict = stats.byDistrict[0];
  const topType = stats.byType[0];
  const typesInUse = stats.byType.filter((entry) => entry.count > 0);
  const topValue = stats.mostValuable[0]?.price ?? 0;
  const topValueShare = percentOf(
    stats.mostValuable.reduce((sum, item) => sum + item.price, 0),
    stats.portfolio
  );
  const lastAdded = stats.recent[0]?.createdAt;

  const kpis: Tile[] = [
    {
      label: "Imóveis",
      Icon: MdOutlineApartment,
      value: String(stats.total),
      hint: stats.addedThisMonth > 0 ? `${stats.addedThisMonth} este mês` : "nenhum novo este mês",
      tone: stats.addedThisMonth > 0 ? "up" : undefined,
      isHero: true,
    },
    { label: "Valor total", Icon: MdOutlinePayments, prefix: "R$", value: portfolio.value, unit: portfolio.unit, hint: `média R$ ${shortBRL(stats.averagePrice)}` },
    {
      label: "Preço / m²",
      Icon: MdOutlineSell,
      prefix: "R$",
      value: Math.round(stats.medianPricePerMeter).toLocaleString("pt-BR"),
      unit: "/m²",
      hint: `mediana de ${stats.pricePerMeterCount} imóveis`,
    },
    { label: "Área média", Icon: MdOutlineSquareFoot, value: Math.round(stats.averageArea).toLocaleString("pt-BR"), unit: "m²", hint: stats.areaRange },
    {
      label: "No mapa",
      Icon: MdOutlineMap,
      value: String(stats.onMap),
      unit: `de ${stats.total}`,
      hint: offMap > 0 ? `${offMap} sem localização` : "todos com localização",
      tone: offMap > 0 ? "attention" : undefined,
    },
  ];

  const details: Tile[] = [
    { label: "Destaques", Icon: MdOutlineStarBorder, value: String(stats.featured), unit: `de ${stats.total}`, hint: `${percentOf(stats.featured, stats.total)}% do catálogo` },
    {
      label: "Fotos",
      Icon: MdOutlinePhotoLibrary,
      value: formatDecimal(stats.averagePhotos),
      unit: "por imóvel",
      hint: stats.fewPhotos > 0 ? `${stats.fewPhotos} com menos de ${MIN_PHOTOS}` : `todos com ${MIN_PHOTOS} ou mais`,
      tone: stats.fewPhotos > 0 ? "attention" : undefined,
    },
    {
      label: "Bairros",
      Icon: MdOutlinePlace,
      value: String(stats.byDistrict.length),
      unit: "com imóveis",
      hint: topDistrict ? `${topDistrict[0]} lidera com ${topDistrict[1]}` : "sem dados",
    },
    { label: "Quartos", Icon: MdOutlineBed, value: formatDecimal(average(stats.rooms)), unit: "em média", hint: `em ${stats.rooms.length} imóveis` },
    { label: "Banheiros", Icon: MdOutlineBathtub, value: formatDecimal(average(stats.bathrooms)), unit: "em média", hint: `em ${stats.bathrooms.length} imóveis` },
    { label: "Vagas", Icon: MdOutlineDirectionsCar, value: formatDecimal(average(stats.garages)), unit: "em média", hint: `em ${stats.garages.length} imóveis` },
  ];

  const qualityRows = [
    { key: "complete", label: "Completo", count: stats.quality.complete, hint: `no mapa, ${MIN_PHOTOS}+ fotos`, color: "bg-action" },
    { key: "attention", label: "Atenção", count: stats.quality.attention, hint: "poucas fotos ou sem preço", color: "bg-attention" },
    { key: "offMap", label: "Fora do mapa", count: stats.quality.offMap, hint: "sem localização", color: "bg-negative" },
  ];

  const buildTile = ({ label, Icon, value, prefix, unit, hint, tone, isHero }: Tile) => (
    <div key={label} className={`min-w-0 px-[1.6rem] py-[1.1rem] flex flex-col gap-[0.2rem] ${isHero ? "rounded-card bg-action text-on-action" : "surface"}`}>
      <div className="flex items-center justify-between gap-[0.8rem]">
        <span className={`min-w-0 truncate ${isHero ? "text-[1.1rem] font-bold leading-[1.4rem] uppercase tracking-[0.06em] opacity-80" : "label"}`}>{label}</span>
        <Icon size={16} className={`shrink-0 ${isHero ? "opacity-80" : "text-soft"}`} />
      </div>

      <div className="min-w-0 flex items-baseline gap-[0.4rem] whitespace-nowrap">
        {prefix && <span className={`text-[1.3rem] font-semibold ${isHero ? "" : "text-body"}`}>{prefix}</span>}
        <span className={`text-[2.4rem] font-bold leading-[3rem] tracking-[-0.01em] ${isHero ? "" : "text-title"}`}>{isLoading ? "—" : value}</span>
        {unit && !isLoading && <span className={`min-w-0 text-[1.3rem] truncate ${isHero ? "opacity-80" : "text-meta"}`}>{unit}</span>}
      </div>

      <span
        className={`min-w-0 flex items-center gap-[0.4rem] text-[1.2rem] ${tone === "attention" ? "font-semibold text-attention" : tone === "up" ? "font-semibold" : isHero ? "opacity-80" : "text-meta"}`}
      >
        {tone === "up" && <MdOutlineArrowUpward size={13} className="shrink-0" />}
        {tone === "attention" && <MdOutlineWarningAmber size={13} className="shrink-0" />}
        <span className="truncate">{isLoading ? "carregando..." : hint}</span>
      </span>
    </div>
  );

  const buildPanelTitle = ({ title, subtitle, aside }: { title: string; subtitle?: string; aside?: React.ReactNode }) => (
    <div className="w-full flex items-start justify-between gap-[1rem]">
      <div className="min-w-0 flex flex-col">
        <span className="text-[1.4rem] font-bold text-title truncate">{title}</span>
        {subtitle && <span className="text-[1.2rem] text-meta truncate">{subtitle}</span>}
      </div>
      {aside}
    </div>
  );

  const buildFooter = (text: string) => (
    <div className="w-full mt-auto flex items-center justify-between gap-[1rem] text-[1.2rem]">
      <span className="min-w-0 text-meta truncate">{text}</span>
      <Link href="/real_estate" className="shrink-0 font-semibold text-action hover:underline">
        Ver todos ›
      </Link>
    </div>
  );

  const buildAvatar = (item?: RealEstate) => (
    <span className="h-[3.2rem] w-[3.2rem] shrink-0 flex items-center justify-center rounded-full bg-surface-3 text-soft overflow-hidden">
      {item?.thumbnail ? <img src={item.thumbnail} alt="" className="h-full w-full object-cover" /> : <MdOutlinePlace size={16} />}
    </span>
  );

  const buildRow = ({ key, href, avatar, title, value, detail, ratio }: { key: string; href?: string; avatar: React.ReactNode; title: string; value: string; detail?: string; ratio?: number }) => {
    const content = (
      <>
        {avatar}
        <span className="min-w-0 grow flex flex-col gap-[0.4rem]">
          <span className="flex items-baseline justify-between gap-[1rem]">
            <span className="min-w-0 text-[1.3rem] font-semibold text-title truncate group-hover:text-action">{title}</span>
            <span className="shrink-0 text-[1.3rem] font-bold text-title">{value}</span>
          </span>
          {detail && <span className="text-[1.2rem] leading-[1.4rem] text-meta truncate">{detail}</span>}
          {ratio !== undefined && (
            <span className="h-[0.3rem] w-full block rounded-full bg-track">
              <span className="h-full block rounded-full bg-action" style={{ width: `${Math.max(ratio * 100, 3)}%` }} />
            </span>
          )}
        </span>
      </>
    );

    return href ? (
      <Link key={key} href={href} className="w-full flex items-center gap-[1.2rem] group">
        {content}
      </Link>
    ) : (
      <div key={key} className="w-full flex items-center gap-[1.2rem]">
        {content}
      </div>
    );
  };

  return (
    <div className="h-full w-full overflow-y-auto scrollbar-thin tabular-nums slashed-zero">
      <div className="w-full flex flex-col xl:flex-row gap-[1rem] xl:min-h-full">
        <div className="min-w-0 grow flex flex-col gap-[1rem]">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-[1rem]">{kpis.map(buildTile)}</div>

          <div className="surface min-h-[20rem] grow px-[1.8rem] pt-[1.4rem] pb-[1rem] flex flex-col gap-[1rem]">
            {buildPanelTitle({
              title: "Distribuição de preços",
              subtitle: `imóveis por faixa de preço e o valor somado em cada uma${stats.unpriced > 0 ? ` · ${stats.unpriced} sem preço fora da conta` : ""}`,
              aside: (
                <div className="shrink-0 hidden md:flex items-center gap-[1.6rem] text-[1.2rem] text-meta">
                  <span className="flex items-center gap-[0.6rem]">
                    <span className="h-[0.2rem] w-[1.6rem] rounded-full bg-chart-1" />
                    Imóveis
                  </span>
                  <span className="flex items-center gap-[0.6rem]">
                    <span className="w-[1.6rem] border-t-2 border-dashed border-chart-accent" />
                    Valor somado
                  </span>
                </div>
              ),
            })}

            <div className="relative min-h-0 grow">
              <ChartContainer className="absolute inset-0">
                <ComposedChart data={stats.priceBrackets} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="price_fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="var(--line)" />
                  {/* interval 0: recharts otherwise drops the labels it guesses would collide. */}
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} interval={0} padding={{ left: 16, right: 16 }} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="count" allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                  <YAxis yAxisId="value" orientation="right" tickLine={false} axisLine={false} width={64} tickFormatter={shortBRL} />
                  <ChartTooltip content={<ChartTooltipContent formatter={(value, dataKey) => (dataKey === "value" ? `R$ ${shortBRL(value)}` : String(value))} />} />
                  <Area yAxisId="count" dataKey="count" name="Imóveis" type="monotone" stroke="var(--chart-1)" strokeWidth={2} fill="url(#price_fill)" dot={DOT} activeDot={{ r: 5 }} />
                  <Line
                    yAxisId="value"
                    dataKey="value"
                    name="Valor somado"
                    type="monotone"
                    stroke="var(--chart-accent)"
                    strokeWidth={1.6}
                    strokeDasharray="5 4"
                    dot={DOT}
                    activeDot={{ r: 5 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-[1rem]">
            <div className="surface min-w-0 p-[1.4rem] flex flex-col gap-[1rem]">
              {buildPanelTitle({ title: "Por tipo", subtitle: `${stats.total} imóveis em ${typesInUse.length} tipos` })}

              <div className="min-h-0 grow flex items-center gap-[1.6rem]">
                <div className="h-[13rem] w-[13rem] 2xl:h-[17rem] 2xl:w-[17rem] shrink-0 relative">
                  <ChartContainer className="h-full w-full">
                    <PieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Pie data={typesInUse} dataKey="count" nameKey="label" innerRadius="70%" outerRadius="100%" paddingAngle={2} strokeWidth={0} startAngle={90} endAngle={-270}>
                        {typesInUse.map((entry, index) => (
                          <Cell key={entry.type} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>

                  <div className="flex flex-col items-center justify-center absolute inset-0 pointer-events-none">
                    <span className="label">Total</span>
                    <span className="text-[2.4rem] font-bold text-title leading-[2.8rem]">{stats.total}</span>
                  </div>
                </div>

                <div className="@container min-w-0 grow flex flex-col gap-[0.8rem]">
                  {stats.byType.map((entry, index) => (
                    <div key={entry.type} className="flex items-center gap-[0.8rem] text-[1.3rem]">
                      <span
                        className="h-[0.9rem] w-[0.9rem] shrink-0 rounded-[0.2rem]"
                        style={{ backgroundColor: entry.count > 0 ? CHART_COLORS[index % CHART_COLORS.length] : "var(--track)" }}
                      />
                      <span className="min-w-0 grow text-body truncate">{entry.label}</span>
                      <span className="shrink-0 font-bold text-title">{entry.count}</span>
                      <span className="w-[3.6rem] shrink-0 text-right text-meta hidden @min-[150px]:block">{percentOf(entry.count, stats.total)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {buildFooter(topType?.count ? `${topType.label} é ${percentOf(topType.count, stats.total)}% do catálogo` : "Nenhum imóvel cadastrado")}
            </div>

            <div className="min-w-0 flex flex-col gap-[1rem]">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-[1rem]">{details.map(buildTile)}</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1rem]">
                <div className="surface min-w-0 p-[1.4rem] flex flex-col gap-[1rem]">
                  {buildPanelTitle({ title: "Qualidade do cadastro", subtitle: `${stats.total} imóveis` })}

                  <div className="h-[0.8rem] w-full flex gap-[0.2rem] rounded-full bg-track overflow-hidden">
                    {qualityRows.map(({ key, count, color }) => count > 0 && <div key={key} className={color} style={{ width: `${percentOf(count, stats.total)}%` }} />)}
                  </div>

                  <div className="flex flex-col gap-[0.6rem]">
                    {qualityRows.map(({ key, label, count, hint, color }) => (
                      <div key={key} className="flex items-center gap-[0.8rem] text-[1.3rem]">
                        <span className={`h-[0.8rem] w-[0.8rem] shrink-0 rounded-full ${color}`} />
                        <span className="shrink-0 text-body">{label}</span>
                        <span className="min-w-0 grow text-[1.2rem] text-meta truncate hidden 2xl:block">{hint}</span>
                        <span className="ml-auto shrink-0 font-bold text-title">{count}</span>
                        <span className="w-[3.6rem] shrink-0 text-right text-meta">{percentOf(count, stats.total)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface min-w-0 p-[1.4rem] flex flex-col gap-[0.8rem]">
                  {buildPanelTitle({ title: "Por área", subtitle: "imóveis por faixa de m²" })}

                  <div className="relative min-h-[9rem] grow">
                    <ChartContainer className="absolute inset-0">
                      <BarChart data={stats.areaBrackets} margin={{ top: 18, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: "var(--line)" }} tickMargin={6} interval={0} tick={{ fontSize: 11 }} />
                        <YAxis hide allowDecimals={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="count" name="Imóveis" fill="var(--chart-1)" radius={[3, 3, 0, 0]} maxBarSize={28}>
                          <LabelList dataKey="count" position="top" className="fill-title text-[1.2rem] font-semibold" />
                        </Bar>
                      </BarChart>
                    </ChartContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-[30rem] 2xl:w-[34rem] shrink-0 grid grid-cols-1 lg:grid-cols-3 xl:flex xl:flex-col gap-[1rem]">
          <div className="surface min-w-0 p-[1.4rem] grow flex flex-col gap-[1rem]">
            {buildPanelTitle({ title: "Bairros com mais imóveis", subtitle: `Top ${Math.min(TOP_COUNT, stats.byDistrict.length)} de ${stats.byDistrict.length}` })}

            <div className="flex flex-col gap-[1rem]">
              {stats.byDistrict
                .slice(0, TOP_COUNT)
                .map(([district, count]) => buildRow({ key: district, avatar: buildAvatar(), title: district, value: String(count), ratio: count / (topDistrict?.[1] || 1) }))}
            </div>

            {buildFooter(topDistrict ? `${topDistrict[0]} tem ${topDistrict[1]} dos ${stats.total}` : "Nenhum imóvel cadastrado")}
          </div>

          <div className="surface min-w-0 p-[1.4rem] grow flex flex-col gap-[1rem]">
            {buildPanelTitle({ title: "Mais valiosos", subtitle: `Top ${stats.mostValuable.length} por preço` })}

            <div className="flex flex-col gap-[1rem]">
              {stats.mostValuable.map((item) =>
                buildRow({
                  key: item._id,
                  href: `/real_estate/edit/${item._id}`,
                  avatar: buildAvatar(item),
                  title: realEstateTitle(item),
                  value: `R$ ${shortBRL(item.price)}`,
                  ratio: item.price / (topValue || 1),
                })
              )}
            </div>

            {buildFooter(stats.mostValuable.length ? `${topValueShare}% do valor total em ${stats.mostValuable.length} imóveis` : "Nenhum imóvel com preço")}
          </div>

          <div className="surface min-w-0 p-[1.4rem] grow flex flex-col gap-[1rem]">
            {buildPanelTitle({ title: "Adicionados recentemente", subtitle: `Últimos ${stats.recent.length}` })}

            <div className="flex flex-col gap-[1rem]">
              {stats.recent.map((item) =>
                buildRow({
                  key: item._id,
                  href: `/real_estate/edit/${item._id}`,
                  avatar: buildAvatar(item),
                  title: realEstateTitle(item),
                  value: item.price > 0 ? `R$ ${shortBRL(item.price)}` : "—",
                  detail: [PROPERTY_TYPES[item.type]?.label, item.address?.district].filter(Boolean).join(" · "),
                })
              )}
            </div>

            {buildFooter(
              lastAdded ? `Último em ${new Date(lastAdded).toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })}` : "Nenhum imóvel cadastrado"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
