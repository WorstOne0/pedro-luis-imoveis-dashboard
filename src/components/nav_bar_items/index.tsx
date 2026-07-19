"use client";

import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
//
import { useIsMounted } from "@/hooks";
import { useSearchStore } from "@/store";
//
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { IoNotificationsOutline, IoSearch } from "react-icons/io5";

const iconButton = "h-[4.4rem] w-[4.4rem] shrink-0 flex justify-center items-center rounded-[1rem] border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer";

/** Right-hand cluster of the page header: search, notifications, theme. */
export default function NavBarItems({ children }: { children?: React.ReactNode }) {
  const setModal = useSearchStore((state) => state.setModal);
  const toggleModal = useSearchStore((state) => state.toggleModal);
  useHotkeys("ctrl+k", () => toggleModal());

  const { resolvedTheme, setTheme } = useTheme();
  // next-themes only knows the theme after hydration; rendering the icon before
  // that gives a server/client mismatch, so hold the slot until mounted.
  const isMounted = useIsMounted();

  return (
    <div className="flex items-center gap-[1rem]">
      <button
        type="button"
        onClick={() => setModal(true)}
        className="h-[4.4rem] w-[26rem] hidden lg:flex items-center gap-[1rem] px-[1.4rem] rounded-[1rem] border border-border bg-card text-muted-foreground hover:bg-muted cursor-pointer"
      >
        <IoSearch size={16} className="shrink-0" />
        <span className="min-w-0 grow text-left text-[1.4rem] truncate">Buscar imóvel, código...</span>
        <span className="text-[1.1rem] px-[0.6rem] py-[0.2rem] rounded-[0.5rem] bg-muted shrink-0">CTRL K</span>
      </button>

      <button type="button" aria-label="Notificações" className={`${iconButton} relative`}>
        <IoNotificationsOutline size={18} />
        <span className="h-[0.8rem] w-[0.8rem] rounded-full bg-primary absolute top-[0.9rem] right-[0.9rem]" />
      </button>

      <button
        type="button"
        aria-label="Alternar tema"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className={iconButton}
      >
        {isMounted && (resolvedTheme === "dark" ? <MdOutlineLightMode size={18} /> : <MdOutlineDarkMode size={18} />)}
      </button>

      {children}
    </div>
  );
}
