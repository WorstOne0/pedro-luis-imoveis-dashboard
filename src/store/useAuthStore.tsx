// Next
import { create } from "zustand";
import Cookies from "js-cookie";
// Services
import { apiService } from "@/services";

export type AuthStoreType = {
  user: User | null;
  //
  isAuthenticated: boolean;
  isLoading: boolean;
  //
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setUser: (user: User) => void;
  //
  login: (email: string, password: string) => Promise<boolean>;
  getSession: () => Promise<void>;
  logout: () => void;
};

export type User = {
  _id: string;
  email: string;
  userName: string;
  role: string;
  //
  screenName: string;
  profilePicture: string;
  thumbnail: string;
};

const useAuthStore = create<AuthStoreType>((set, get) => ({
  user: null,
  //
  isAuthenticated: false,
  isLoading: true,
  //
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setUser: (user: User) => set({ user }),
  //
  login: async (email: string, password: string) => {
    const response = await apiService.post("/login", { email, password });

    if (response.status !== 200) return false;

    const accessToken = response.data.accessToken;
    Cookies.set("accessToken", accessToken, { expires: 7 });

    return true;
  },
  getSession: async () => {
    if (!get().isAuthenticated) set({ isLoading: true });

    try {
      const response = await apiService.get("/session");
      const isValid = response.data.status == 200;
      set({ isLoading: false, isAuthenticated: isValid, user: response.data.user });
    } catch {
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },
  logout: () => {
    Cookies.remove("accessToken");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
