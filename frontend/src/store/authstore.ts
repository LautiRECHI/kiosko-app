import { create } from "zustand";

interface AuthUser {
  token: string;
  tenantId: string;
  nombre: string;
  role: "admin" | "kiosco";
}

interface AuthStore {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  login: (user) => {
    localStorage.setItem("auth", JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("auth");
    set({ user: null });
  },
}));

const stored = localStorage.getItem("auth");
if (stored) {
  useAuthStore.setState({ user: JSON.parse(stored) });
}