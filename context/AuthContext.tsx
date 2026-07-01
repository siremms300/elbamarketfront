'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  verificationTier: string;
  isAdmin: boolean;
  adminLevel?: number;
  adminPermissions?: any;
  warehouseOperatorProfile?: {
    _id: string;
    name: string;
    code: string;
    location: { state: string };
  };
  farmerProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: any) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isWarehouse: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('elba_token');
    if (storedToken) {
      setToken(storedToken);
      authApi.getMe(storedToken)
        .then((res) => {
          if (res.success) {
            setUser(res.data.user);
          } else {
            localStorage.removeItem('elba_token');
            setToken(null);
          }
        })
        .catch(() => {
          localStorage.removeItem('elba_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('elba_token', res.data.token);
    }
    return { success: res.success, message: res.message };
  };

  const register = async (data: any) => {
    const res = await authApi.register(data);
    if (res.success) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem('elba_token', res.data.token);
    }
    return { success: res.success, message: res.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('elba_token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    // isAdmin: user?.isAdmin || false,
    isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
    isWarehouse: user?.role === 'warehouse_operator' || user?.role === 'admin' || user?.role === 'super_admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}