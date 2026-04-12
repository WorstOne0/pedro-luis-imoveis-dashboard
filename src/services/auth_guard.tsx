"use client";

// Next
import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
// Store
import { useAuthStore } from "@/store";

const LOGIN_ROUTE = "/login";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, getSession } = useAuthStore((state) => state);

  const checkAuth = useCallback(async () => {
    await getSession();
  }, [getSession]);

  useEffect(() => {
    checkAuth();

    window.addEventListener("focus", checkAuth);
    return () => window.removeEventListener("focus", checkAuth);
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(LOGIN_ROUTE);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div className="h-screen w-screen flex justify-center items-center">Loading</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
