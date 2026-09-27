"use client";

// Next
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// Controllers
import { useAuthController } from "@/core/controllers";
// Hooks
import { useIsMounted } from "@/hooks";
// Components
import HeaderActions from "./header_actions";
// Icons
import { MdOutlineAdd, MdOutlineArrowBack, MdOutlineChevronRight } from "react-icons/md";

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: "Dashboard" },
  real_estate: { title: "Imóveis", subtitle: "todos os imóveis cadastrados" },
  analytics: { title: "Análises", subtitle: "desempenho do portfólio" },
  notifications: { title: "Notificações", subtitle: "avisos e atualizações" },
  settings: { title: "Configurações", subtitle: "preferências da conta" },
};

const greeting = (hour: number) => {
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";

  return "Boa noite";
};

// "sexta-feira, 18 de julho" → "Sexta, 18 de julho".
const formatToday = (date: Date) =>
  date
    .toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })
    .replace(/-feira/, "")
    .replace(/^./, (char) => char.toUpperCase());

export default function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthController((state) => state.user);

  // The clock differs between the server render and the browser, so date and greeting wait for the mount.
  const now = useIsMounted() ? new Date() : null;

  const [section, ...rest] = pathname.split("/").filter(Boolean);
  const isDashboard = section === "dashboard";
  const isForm = rest[0] === "add" || rest[0] === "edit";
  const showAdd = isDashboard || (section === "real_estate" && rest.length === 0);
  const firstName = (user?.screenName ?? "").split(" ")[0];

  const title = isDashboard
    ? `${now ? greeting(now.getHours()) : "Olá"}${firstName ? `, ${firstName}` : ""}`
    : isForm
      ? rest[0] === "add"
        ? "Adicionar imóvel"
        : "Editar imóvel"
      : (TITLES[section]?.title ?? section);
  const subtitle = isDashboard ? `${now ? `${formatToday(now)} · ` : ""}visão geral do portfólio` : isForm ? undefined : TITLES[section]?.subtitle;

  return (
    <header className="w-full px-[0.4rem] pt-[0.4rem] pb-[1.4rem] shrink-0 flex items-center justify-between gap-[2rem]">
      <div className="min-w-0 flex items-center gap-[1.2rem]">
        {isForm && (
          <button
            type="button"
            aria-label="Voltar"
            onClick={() => router.back()}
            className="h-[4rem] w-[4rem] shrink-0 flex items-center justify-center rounded-control border border-line bg-surface text-body hover:bg-surface-2 cursor-pointer"
          >
            <MdOutlineArrowBack size={18} />
          </button>
        )}

        <div className="min-w-0 flex flex-col">
          {isForm && (
            <span className="flex items-center text-[1.2rem] text-meta">
              <Link href="/real_estate" className="hover:text-title">
                Imóveis
              </Link>
              <MdOutlineChevronRight size={15} className="mx-[0.2rem]" />
              {rest[0] === "add" ? "Novo imóvel" : "Editar imóvel"}
            </span>
          )}

          <h1 className="text-[2.6rem] font-bold text-title leading-[3.2rem] tracking-[-0.01em] truncate">{title}</h1>
          {subtitle && <span className="text-[1.4rem] text-meta">{subtitle}</span>}
        </div>
      </div>

      <HeaderActions>
        {showAdd && (
          <Link
            href="/real_estate/add"
            className="h-[4rem] px-[1.6rem] shrink-0 flex items-center gap-[0.6rem] rounded-control bg-action text-[1.4rem] font-semibold text-on-action hover:bg-action-hover"
          >
            <MdOutlineAdd size={18} />
            Adicionar
          </Link>
        )}
      </HeaderActions>
    </header>
  );
}
