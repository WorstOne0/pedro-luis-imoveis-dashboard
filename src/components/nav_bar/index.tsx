/* eslint-disable @next/next/no-img-element */
"use client";

// Packages
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
// Components
import { Icon } from "@/components";
import type { IconName } from "@/components/icon";
// Hooks / Store
import { useApiFetch } from "@/hooks";
import { useAuthStore } from "@/store";
import type { RealEstate } from "@/store/useRealEstateStore";
//
import logo from "@/../public/logo/logo.png";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Same SWR key the listing page uses, so the badge costs no extra request.
  const { data: realEstateList } = useApiFetch<RealEstate[]>("/real_estate?sort=recent");

  const routes: { value: string; name: string; icon: IconName; badge?: number; dot?: boolean }[] = [
    { value: "/dashboard", name: "Dashboard", icon: "MdSpaceDashboard" },
    { value: "/real_estate", name: "Imóveis", icon: "MdApartment", badge: realEstateList?.length },
    { value: "/analytics", name: "Análises", icon: "MdAnalytics" },
    { value: "/notifications", name: "Notificações", icon: "MdNotifications", dot: true },
    { value: "/settings", name: "Configurações", icon: "MdOutlineSettings" },
  ];

  const initials = (user?.screenName ?? "PL")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="h-full min-w-[25rem] w-[25rem] shrink-0 flex flex-col bg-card border border-border rounded-[1.6rem]">
      {/* Brand */}
      <div className="flex items-center gap-[1.2rem] px-[1.6rem] py-[1.8rem]">
        <img className="h-[4.2rem] w-[4.2rem] shrink-0 rounded-[1rem] object-contain" src={logo.src} alt="Pedro Luis Imóveis" />

        <div className="min-w-0 flex flex-col">
          <span className="text-[1.6rem] font-bold leading-[2rem] truncate">Pedro Luis Imóveis</span>
          <span className="text-[1.2rem] text-muted-foreground leading-[1.6rem]">Painel admin</span>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Menu — top aligned, not centred: the eye expects navigation to start
          under the brand, and a vertically centred block drifts as items grow. */}
      <nav className="min-h-0 grow flex flex-col gap-[0.4rem] px-[1rem] py-[1.4rem] overflow-y-auto">
        <span className="text-[1.1rem] font-semibold uppercase tracking-wide text-muted-foreground px-[1rem] pb-[0.6rem]">Menu</span>

        {routes.map((route) => {
          const isActive = pathname.startsWith(route.value);

          return (
            <Link
              key={route.value}
              href={route.value}
              className={`
                h-[4.4rem] w-full flex items-center gap-[1.2rem] px-[1.2rem] rounded-[1rem] select-none transition-colors
                ${isActive ? "bg-muted font-semibold text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"}
              `}
            >
              <Icon name={route.icon} size={18} className="shrink-0" />

              <span className="min-w-0 grow text-[1.4rem] truncate">{route.name}</span>
              {route.badge !== undefined && <span className="text-[1.2rem] text-muted-foreground">{route.badge}</span>}
              {route.dot && <span className="h-[0.8rem] w-[0.8rem] rounded-full bg-primary shrink-0" />}
            </Link>
          );
        })}
      </nav>

      <div className="h-px w-full bg-border" />

      {/* User */}
      <div className="flex items-center gap-[1.2rem] px-[1.4rem] py-[1.6rem]">
        {user?.profilePicture ? (
          <img className="h-[4rem] w-[4rem] shrink-0 rounded-full object-cover" src={user.profilePicture} alt="" />
        ) : (
          <div className="h-[4rem] w-[4rem] shrink-0 rounded-full bg-muted flex justify-center items-center">
            <span className="text-[1.4rem] font-bold text-muted-foreground">{initials}</span>
          </div>
        )}

        <div className="min-w-0 grow flex flex-col">
          <span className="text-[1.4rem] font-semibold truncate">{user?.screenName ?? "—"}</span>
          <span className="text-[1.2rem] text-muted-foreground truncate">{user?.userName ?? ""}</span>
        </div>

        <button
          type="button"
          aria-label="Sair"
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="h-[3.6rem] w-[3.6rem] shrink-0 flex justify-center items-center rounded-[0.8rem] border border-border text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
        >
          <Icon name="FiLogOut" size={16} />
        </button>
      </div>
    </div>
  );
}
