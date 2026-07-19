"use client";

// Next
import { Poppins } from "next/font/google";
// Services
import { ThemeProvider } from "@/services";
// Styles
import "@/styles/global.css";

// Poppins has no variable font on Google Fonts, so the weights actually
// used have to be listed explicitly.
const poppins = Poppins({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <body className={`h-full w-full flex ${poppins.className} antialiased`}>{children}</body>
      </ThemeProvider>
    </html>
  );
}
