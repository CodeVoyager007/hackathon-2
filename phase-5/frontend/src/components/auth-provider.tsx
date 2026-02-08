"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Use better-auth hook to manage session
  const { data: session, isPending, error } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
        if (session) {
            console.log("Auth Provider: Session found", session);
            setIsAuthenticated(true);
            setUser(session.user);
        } else {
            console.log("Auth Provider: No session found", error);
            setIsAuthenticated(false);
            setUser(null);
            // Only redirect if explicitly trying to access a protected route?
            // The individual pages handle redirects usually.
        }
        setLoading(false);
    }
  }, [session, isPending, error]);

  const logout = async () => {
    await authClient.signOut();
    setIsAuthenticated(false);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};