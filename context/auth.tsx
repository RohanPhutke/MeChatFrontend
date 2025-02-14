'use client';
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if(token === null) setIsLoading(false);
    
    if (token && tokenExpiry && Date.now() < parseInt(tokenExpiry)) {
      console.log("TOken exists and within expiry");
      fetchUser(token).finally(() => setIsLoading(false));
    } else if(token && tokenExpiry && Date.now() > parseInt(tokenExpiry) ) {
      logout(); 
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      logout();
    }
    finally {
      setIsLoading(false); 
    }
  };

  const login = async (email: string, password: string) => {
    try {
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, message: data?.message || "Invalid credentials" };
      }

      const data = await res.json();
      const token = data.jwt;
      const expiryTime = Date.now() + 3600 * 1000;

      localStorage.setItem("jwt", token);
      localStorage.setItem("tokenExpiry", expiryTime.toString());

      setUser(data.user);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, message: "An error occurred. Please try again." };
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt'); 
    localStorage.removeItem('tokenExpiry');
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}