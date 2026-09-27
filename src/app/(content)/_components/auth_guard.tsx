"use client";

// Next
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
// Controllers
import { useAuthController } from "@/core/controllers";
// Services
import { api } from "@/services";

// Client-side only: with no middleware, a protected page is served first and hidden after.
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthController((state) => state.isAuthenticated);
  const isLoading = useAuthController((state) => state.isLoading);
  const setSession = useAuthController((state) => state.setSession);

  const checkSession = useCallback(async () => {
    try {
      const response = await api.get("/session");
      setSession(response.data.status == 200 ? response.data.user : null);
    } catch {
      setSession(null);
    }
  }, [setSession]);

  // Checked again on focus, so a session that expired in another tab is noticed here.
  useEffect(() => {
    checkSession();

    window.addEventListener("focus", checkSession);
    return () => window.removeEventListener("focus", checkSession);
  }, [checkSession]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="h-full w-full flex items-center justify-center text-[1.4rem] text-meta">Carregando...</div>;
  if (!isAuthenticated) return null;

  return children;
}
