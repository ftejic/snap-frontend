import api, { setLogoutFunction } from "@/api";
import { User } from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      await fetchUserData();
      return true;
    } catch (error) {
      console.log("Login failed!", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await api.get<User>("/api/auth/user-info");
      setUser(response.data);
    } catch (error) {
      logout();
      console.log("Error occured while fetching user data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLogoutFunction(logout);
    const initializeAuth = async () => {
      await fetchUserData();
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
