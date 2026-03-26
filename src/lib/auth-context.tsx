import React, { createContext, useContext, useState, useCallback } from "react";
import { User } from "./mock-data";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: "seeker" | "recruiter") => void;
  logout: () => void;
  setRole: (role: "seeker" | "recruiter") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((email: string, _password: string, role: "seeker" | "recruiter") => {
    setUser({
      id: "1",
      name: role === "seeker" ? "Alex Chen" : "Sarah Miller",
      email,
      role,
    });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const setRole = useCallback((role: "seeker" | "recruiter") => {
    if (user) setUser({ ...user, role });
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
