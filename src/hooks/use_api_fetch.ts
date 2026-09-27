"use client";

// Next
import useSWR from "swr";
// Services
import { api } from "@/services";

// The url is the cache key: same url, one request; new url, refetch. Pass null to skip.
export const useApiFetch = <T,>(url: string | null) => {
  const { data, error, isLoading, mutate } = useSWR(url, async (path: string) => {
    const response = await api.get(path);
    return response.data;
  });

  return {
    data: data?.payload as T | undefined,
    total: data?.total as number | undefined,
    isLoading,
    error,
    refresh: mutate,
  };
};
