// Next
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// Components
import Providers from "./providers";
// Styles
import "@/styles/index.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Server component on purpose: "use client" here would silently drop metadata.
export const metadata: Metadata = {
  title: { default: "Painel · Pedro Luis Imóveis", template: "%s · Painel Pedro Luis" },
  icons: { icon: "/logo/icon.png" },
  // An admin panel has nothing for a search engine.
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning covers the class next-themes puts on <html>.
    <html lang="pt-BR" suppressHydrationWarning className={inter.variable}>
      <body className="h-full w-full flex">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
