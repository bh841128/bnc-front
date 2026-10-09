import React, { createContext, useContext, useMemo, useState } from "react";

type User = { id: number; email: string; role: string };

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("bnc_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("bnc_user");
    return raw ? JSON.parse(raw) : null;
  });

  const value = useMemo(
    () => ({
      token,
      user,
      setAuth: (t: string, u: User) => {
        localStorage.setItem("bnc_token", t);
        localStorage.setItem("bnc_user", JSON.stringify(u));
        setToken(t);
        setUser(u);
      },
      logout: () => {
        localStorage.removeItem("bnc_token");
        localStorage.removeItem("bnc_user");
        setToken(null);
        setUser(null);
      },
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthProvider missing");
  return ctx;
}
