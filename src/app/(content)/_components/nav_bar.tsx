/* eslint-disable @next/next/no-img-element */
"use client";

// Next
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
// Controllers
import { useAuthController } from "@/core/controllers";
// Models
import type { RealEstate } from "@/core/models";
// Hooks
import { useApiFetch } from "@/hooks";
// Icons
import { MdOutlineSpaceDashboard, MdOutlineApartment, MdOutlineAnalytics, MdOutlineNotifications, MdOutlineSettings, MdOutlineLogout } from "react-icons/md";
// Assets
import logo from "@/../public/logo/logo.png";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthController((state) => state.user);
  const setSession = useAuthController((state) => state.setSession);

  // The listing page's SWR key, so the badge costs no request of its own.
  const { data: realEstateList } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");

  const routes = [
    { value: "/dashboard", name: "Dashboard", Icon: MdOutlineSpaceDashboard },
    { value: "/real_estate", name: "Imóveis", Icon: MdOutlineApartment, badge: realEstateList?.length },
    { value: "/analytics", name: "Análises", Icon: MdOutlineAnalytics },
    { value: "/notifications", name: "Notificações", Icon: MdOutlineNotifications },
    { value: "/settings", name: "Configurações", Icon: MdOutlineSettings },
  ];

  const initials = (user?.screenName ?? "PL")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const logout = () => {
    Cookies.remove("accessToken");
    setSession(null);
    router.replace("/login");
  };

  return (
    <aside className="surface h-full w-[24rem] shrink-0 flex flex-col">
      <div className="h-[7.2rem] px-[1.6rem] shrink-0 flex items-center gap-[1.2rem] border-b border-line">
        <img src={logo.src} alt="" className="h-[3.8rem] w-[3.8rem] shrink-0 object-contain" />

        <div className="min-w-0 flex flex-col">
          <span className="text-[1.5rem] font-bold text-title truncate">Pedro Luis Imóveis</span>
          <span className="text-[1.2rem] text-meta">Painel administrativo</span>
        </div>
      </div>

      <nav className="min-h-0 grow px-[1rem] py-[1.4rem] flex flex-col gap-[0.2rem] overflow-y-auto scrollbar-thin">
        <span className="label px-[1rem] pb-[0.8rem]">Menu</span>

        {routes.map(({ value, name, Icon, badge }) => {
          const isActive = pathname.startsWith(value);

          return (
            <Link
              key={value}
              href={value}
              className={`h-[4rem] px-[1rem] flex items-center gap-[1.2rem] rounded-control text-[1.4rem] select-none transition-colors
                ${isActive ? "bg-action-tint font-semibold text-action" : "text-body hover:bg-surface-2 hover:text-title"}`}
            >
              <Icon size={19} className="shrink-0" />
              <span className="min-w-0 grow truncate">{name}</span>
              {badge !== undefined && <span className="text-[1.2rem] text-meta tabular-nums">{badge}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-[1.4rem] py-[1.4rem] shrink-0 flex items-center gap-[1.2rem] border-t border-line">
        {user?.profilePicture ? (
          <img src={user.profilePicture} alt="" className="h-[3.6rem] w-[3.6rem] shrink-0 rounded-full object-cover" />
        ) : (
          <span className="h-[3.6rem] w-[3.6rem] shrink-0 flex items-center justify-center rounded-full bg-surface-3 text-[1.3rem] font-bold text-meta">{initials}</span>
        )}

        <div className="min-w-0 grow flex flex-col">
          <span className="text-[1.4rem] font-semibold text-title truncate">{user?.screenName ?? "—"}</span>
          <span className="text-[1.2rem] text-meta truncate">{user?.userName ?? ""}</span>
        </div>

        <button
          type="button"
          aria-label="Sair"
          title="Sair"
          onClick={logout}
          className="h-[3.6rem] w-[3.6rem] shrink-0 flex items-center justify-center rounded-control text-meta hover:text-negative hover:bg-surface-2 cursor-pointer"
        >
          <MdOutlineLogout size={18} />
        </button>
      </div>
    </aside>
  );
}
