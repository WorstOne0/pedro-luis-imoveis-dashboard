// Next
import { create } from "zustand";
// Models
import type { User } from "@/core/models";

// The requests live in the login page and AuthGuard; this only holds what they found.
type AuthController = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setSession: (user: User | null) => void;
};

export const useAuthController = create<AuthController>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setSession: (user) => set({ user, isAuthenticated: Boolean(user), isLoading: false }),
}));
