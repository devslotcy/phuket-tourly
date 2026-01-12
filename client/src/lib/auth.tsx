import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { apiRequest } from "./queryClient";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/me", { credentials: "include" });
      if (response.ok) {
        const data = await response.json();
        setAdmin(data);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest("POST", "/api/admin/login", { email, password });
      if (response.ok) {
        await checkAuth();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout");
    } finally {
      setAdmin(null);
    }
  };

  return (
    <AuthContext.Provider value={{ admin, isLoading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
