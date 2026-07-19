"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
//
import { NavBarItems } from "@/components";
import { useIsMounted } from "@/hooks";
import { useAuthStore } from "@/store";
//
import { IoAdd, IoArrowBack } from "react-icons/io5";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

type Crumb = { name: string; href?: string };

const greeting = (hour: number) => {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";

  return "Boa noite";
};

const formatToday = (date: Date) => {
  const formatted = date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" });
  // pt-BR gives "sexta-feira, 18 de julho"; the mockup wants "Sexta, 18 de julho".
  return formatted.replace(/-feira/, "").replace(/^./, (char) => char.toUpperCase());
};

export default function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Date and greeting depend on the clock, which differs between the server
  // render and the browser. Filling them in after mount avoids the mismatch.
  const now = useIsMounted() ? new Date() : null;

  const segments = pathname.split("/").filter(Boolean);
  const [section, ...rest] = segments;

  const isDashboard = section === "dashboard";
  const isRealEstateList = section === "real_estate" && rest.length === 0;
  const isAdd = rest[0] === "add";
  const isEdit = rest[0] === "edit";

  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    real_estate: "Imóveis",
    analytics: "Análises",
    notifications: "Notificações",
    settings: "Configurações",
  };

  const subtitles: Record<string, string> = {
    real_estate: "todos os imóveis cadastrados",
    analytics: "desempenho do portfólio",
    notifications: "avisos e atualizações",
    settings: "preferências da conta",
  };

  let title = titles[section] ?? section;
  let subtitle: string | undefined = subtitles[section];
  const crumbs: Crumb[] = [];

  if (isAdd || isEdit) {
    crumbs.push({ name: "Imóveis", href: "/real_estate" }, { name: isAdd ? "Novo imóvel" : "Editar imóvel" });
    title = isAdd ? "Adicionar imóvel" : "Editar imóvel";
    subtitle = undefined;
  }

  const firstName = (user?.screenName ?? "").split(" ")[0];

  return (
    <div className="w-full flex items-start justify-between gap-[2rem] px-[0.4rem] pb-[1.2rem]">
      <div className="min-w-0 flex items-center gap-[1.2rem]">
        {crumbs.length > 0 && (
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => router.back()}
            className="h-[4.4rem] w-[4.4rem] shrink-0 flex justify-center items-center rounded-[1rem] border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
          >
            <IoArrowBack size={18} />
          </button>
        )}

        <div className="min-w-0 flex flex-col">
          {crumbs.length > 0 && (
            <div className="flex items-center text-[1.3rem] text-muted-foreground">
              {crumbs.map((crumb, index) => (
                <div key={crumb.name} className="flex items-center">
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground">
                      {crumb.name}
                    </Link>
                  ) : (
                    <span>{crumb.name}</span>
                  )}
                  {index < crumbs.length - 1 && <MdOutlineKeyboardArrowRight size={16} className="mx-[0.2rem]" />}
                </div>
              ))}
            </div>
          )}

          <h1 className="text-[2.8rem] font-bold leading-[3.4rem] truncate">
            {isDashboard ? `${now ? greeting(now.getHours()) : "Olá"}${firstName ? `, ${firstName}` : ""}` : title}
          </h1>

          {isDashboard ? (
            <span className="text-[1.4rem] text-muted-foreground">
              {now ? `${formatToday(now)} · ` : ""}visão geral do portfólio
            </span>
          ) : (
            subtitle && <span className="text-[1.4rem] text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </div>

      <NavBarItems>
        {(isDashboard || isRealEstateList) && (
          <Link
            href="/real_estate/add"
            className="h-[4.4rem] shrink-0 flex items-center gap-[0.8rem] px-[1.8rem] rounded-[1rem] bg-primary text-white font-semibold text-[1.5rem] hover:opacity-90"
          >
            <IoAdd size={20} />
            Adicionar
          </Link>
        )}
      </NavBarItems>
    </div>
  );
}
