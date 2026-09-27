"use client";

// Next
import { useTheme } from "next-themes";
import { useHotkeys } from "react-hotkeys-hook";
// Controllers
import { useSearchController } from "@/core/controllers";
// Hooks
import { useIsMounted } from "@/hooks";
// Icons
import { MdOutlineDarkMode, MdOutlineLightMode, MdOutlineSearch } from "react-icons/md";

// Right side of the page header: search (Ctrl K), theme, and whatever action the page passes in.
export default function HeaderActions({ children }: { children?: React.ReactNode }) {
  const setIsOpen = useSearchController((state) => state.setIsOpen);
  const toggle = useSearchController((state) => state.toggle);
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known after hydration; the icon and its label wait for the mount.
  const isMounted = useIsMounted();

  useHotkeys("ctrl+k", (event) => {
    event.preventDefault();
    toggle();
  });

  const isDark = isMounted && resolvedTheme === "dark";
  const themeLabel = !isMounted ? "Alternar tema" : isDark ? "Ativar modo claro" : "Ativar modo escuro";

  return (
    <div className="flex items-center gap-[0.8rem]">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-[4rem] w-[26rem] px-[1.2rem] hidden lg:flex items-center gap-[0.8rem] rounded-control border border-line bg-surface text-meta hover:bg-surface-2 cursor-pointer"
      >
        <MdOutlineSearch size={18} className="shrink-0" />
        <span className="min-w-0 grow text-left text-[1.4rem] truncate">Buscar imóvel, código...</span>
        <span className="h-[2.2rem] px-[0.6rem] flex items-center rounded-[0.4rem] bg-surface-2 text-[1.1rem] font-semibold">CTRL K</span>
      </button>

      <button
        type="button"
        aria-label={themeLabel}
        title={themeLabel}
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className="h-[4rem] w-[4rem] shrink-0 flex items-center justify-center rounded-control border border-line bg-surface text-meta hover:text-title hover:bg-surface-2 cursor-pointer"
      >
        {isMounted && (isDark ? <MdOutlineLightMode size={18} /> : <MdOutlineDarkMode size={18} />)}
      </button>

      {children}
    </div>
  );
}
