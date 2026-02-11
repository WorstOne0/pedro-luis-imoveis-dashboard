"use client";

// Packages
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
// Components
import { Icon, Card } from "@/components";
//
import logo from "@/../public/logo/logo.png";
import textLogo from "@/../public/logo/text_logo.png";

export default function NavBar() {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(true);

  const buttons = [
    { value: "/dashboard", name: "Dashboard", icon: <Icon name="MdSpaceDashboard" size={18} /> },
    { value: "/real_estate", name: "Imóveis", icon: <Icon name="MdApartment" size={18} /> },
    { value: "/analytics", name: "Análises", icon: <Icon name="MdAnalytics" size={18} /> },
    { value: "/notifications", name: "Notificações", icon: <Icon name="MdNotifications" size={18} /> },
    { value: "/settings", name: "Configurações", icon: <Icon name="MdOutlineSettings" size={18} /> },
  ];

  const createButton = ({ route, index }: { route: any; index: number }) => {
    return (
      <Card key={`nav_button_${index}`} className="w-full mb-[1rem] last:mb-0" onClick={(e) => e.stopPropagation()}>
        <Link
          href={route.value}
          className={`
            min-h-[3.5rem] h-[3.5rem] w-full flex justify-center items-center gap-3 px-3 cursor-pointer select-none overflow-hidden rounded-[0.8rem] 
            ${pathname === route.value ? "bg-primary text-white" : "text-primary"}`}
        >
          <div>{route.icon}</div>
          {isNavOpen && <span className={`min-w-0 grow text-[1.4rem] ${pathname === route.value ? "text-white" : "text-black"}`}>{route.name}</span>}
        </Link>
      </Card>
    );
  };

  const handleNavBarSize = () => setIsNavOpen(!isNavOpen);

  return (
    <div
      className={`
        h-full flex flex-col border-r border-gray-300 px-[1rem] py-[1rem] relative
        transition-all duration-200 ${isNavOpen ? "min-w-[22rem] w-[22rem]" : "min-w-[6rem] w-[6.5rem]"}
      `}
      onClick={handleNavBarSize}
    >
      {/* Open/Close Button */}
      <div
        className="
          h-[3rem] w-[3rem] rounded-full flex items-center justify-center border border-gray-300 bg-background
          absolute top-[6rem] right-[-3rem] -translate-x-1/2 -translate-y-1/2 cursor-pointer
        "
      >
        {isNavOpen ? (
          <Icon name="MdOutlineKeyboardDoubleArrowLeft" size={16} className="text-gray-500" />
        ) : (
          <Icon name="MdOutlineKeyboardDoubleArrowRight" size={16} className="text-gray-500" />
        )}
      </div>

      {/* Top */}
      <div className="w-full flex items-start justify-center">
        <div className="w-full flex justify-between items-center">
          <img className="h-[4.5rem] w-[4.5rem] " src={logo.src} alt="" />
          <img className="min-w-0 grow" src={textLogo.src} alt="" />
        </div>
      </div>

      {/* Middle */}
      <div className="min-h-0 grow w-full flex flex-col items-center justify-center py-3">
        {buttons.map((route, index) => createButton({ route, index }))}
      </div>

      {/* Bottom */}
      <div className="flex items-end pb-[1rem]">
        <div className={`w-full flex items-center ${isNavOpen ? "flex-row-reverse" : "flex-col justify-center"}`}>
          <Icon name="FiLogOut" size={22} className={`cursor-pointer ${isNavOpen ? "" : "mb-[1.5rem]"}`} />

          {isNavOpen && (
            <div className="min-w-0 grow ml-[1rem] flex flex-col">
              <span className="text-[1.6rem] font-bold">Lucca G.</span>
              <span className="text-[1.2rem]">_divideByZero</span>
            </div>
          )}
          <img className="w-[4.3rem] h-[4.3rem] rounded-full" src="https://avatars.githubusercontent.com/u/31835808?v=4" alt="" />
        </div>
      </div>
    </div>
  );
}
