"use client";

// Next
import { ThemeProvider } from "next-themes";

// Rendered inside <body>: ThemeProvider injects a <script>, and one as a child of <html> breaks hydration.
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
