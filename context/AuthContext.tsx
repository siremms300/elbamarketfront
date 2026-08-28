 // client/context/AuthContext.tsx
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

// Use a consistent token key
const TOKEN_KEY = 'elber_token';
const USER_KEY = 'elber_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken) {
          setToken(storedToken);
          
          // Try to restore user from cache first (instant restore)
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              setUser(parsedUser);
            } catch (e) {
              console.error('Failed to parse stored user:', e);
            }
          }

          // Then validate with server (background)
          try {
            const res = await authApi.getMe(storedToken);
            if (res.success && res.data?.user) {
              setUser(res.data.user);
              localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
            } else {
              // Token is invalid
              console.error('Invalid token response:', res);
              localStorage.removeItem(TOKEN_KEY);
              localStorage.removeItem(USER_KEY);
              setToken(null);
              setUser(null);
            }
          } catch (error) {
            console.error('Auth validation error:', error);
            // Keep user logged in if we have cached data
            // Only clear if no cached user
            if (!storedUser) {
              localStorage.removeItem(TOKEN_KEY);
              setToken(null);
              setUser(null);
            }
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth init error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login({ email, password });
      console.log('Login response:', res);
      
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        return { success: true, message: res.message };
      }
      
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const register = async (data: any) => {
    try {
      const res = await authApi.register(data);
      console.log('Register response:', res);
      
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setToken(res.data.token);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.data.user));
        return { success: true, message: res.message };
      }
      
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    
    // Optional: Redirect to home after logout
    window.location.href = '/';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && !!token,
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















































































// // client/context/AuthContext.tsx
// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authApi } from '@/lib/api';

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   role: string;
//   verificationTier: string;
//   isAdmin: boolean;
//   adminLevel?: number;
//   adminPermissions?: any;
//   warehouseOperatorProfile?: {
//     _id: string;
//     name: string;
//     code: string;
//     location: { state: string };
//   };
//   farmerProfile?: any;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
//   register: (data: any) => Promise<{ success: boolean; message: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   isWarehouse: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored token on mount
//     const initAuth = async () => {
//       const storedToken = localStorage.getItem('elber_token');
      
//       if (storedToken) {
//         setToken(storedToken);
//         try {
//           const res = await authApi.getMe(storedToken);
//           if (res.success) {
//             setUser(res.data.user);
//           } else {
//             // Token is invalid
//             localStorage.removeItem('elber_token');
//             setToken(null);
//             setUser(null);
//           }
//         } catch (error) {
//           console.error('Auth initialization error:', error);
//           // Don't clear token on network errors - only on auth failures
//           // localStorage.removeItem('elber_token');
//           // setToken(null);
//           // setUser(null);
//         }
//       }
      
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await authApi.login({ email, password });
//       if (res.success) {
//         setUser(res.data.user);
//         setToken(res.data.token);
//         localStorage.setItem('elber_token', res.data.token);
        
//         // Also store user data for faster restoration
//         localStorage.setItem('elber_user', JSON.stringify(res.data.user));
//       }
//       return { success: res.success, message: res.message };
//     } catch (error) {
//       console.error('Login error:', error);
//       return { success: false, message: 'Network error. Please try again.' };
//     }
//   };

//   const register = async (data: any) => {
//     try {
//       const res = await authApi.register(data);
//       if (res.success) {
//         setUser(res.data.user);
//         setToken(res.data.token);
//         localStorage.setItem('elber_token', res.data.token);
//         localStorage.setItem('elber_user', JSON.stringify(res.data.user));
//       }
//       return { success: res.success, message: res.message };
//     } catch (error) {
//       console.error('Register error:', error);
//       return { success: false, message: 'Network error. Please try again.' };
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('elber_token');
//     localStorage.removeItem('elber_user');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
//     isWarehouse: user?.role === 'warehouse_operator' || user?.role === 'admin' || user?.role === 'super_admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }








































// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authApi } from '@/lib/api';

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   role: string;
//   verificationTier: string;
//   isAdmin: boolean;
//   adminLevel?: number;
//   adminPermissions?: any;
//   warehouseOperatorProfile?: {
//     _id: string;
//     name: string;
//     code: string;
//     location: { state: string };
//   };
//   farmerProfile?: any;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
//   register: (data: any) => Promise<{ success: boolean; message: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   isWarehouse: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const loadUser = async () => {
//       const storedToken = localStorage.getItem('elba_token');
      
//       if (storedToken) {
//         setToken(storedToken);
        
//         try {
//           const res = await authApi.getMe(storedToken);
//           if (res.success) {
//             setUser(res.data.user);
//           } else {
//             localStorage.removeItem('elba_token');
//             setToken(null);
//             setUser(null);
//           }
//         } catch {
//           // If API fails, still try to keep user from cache
//           const cachedUser = localStorage.getItem('elba_user');
//           if (cachedUser) {
//             try {
//               setUser(JSON.parse(cachedUser));
//             } catch {
//               setUser(null);
//             }
//           }
//         }
//       }
      
//       setLoading(false);
//     };

//     loadUser();
//   }, []);

//   // Cache user when it changes
//   useEffect(() => {
//     if (user) {
//       localStorage.setItem('elba_user', JSON.stringify(user));
//     } else {
//       localStorage.removeItem('elba_user');
//     }
//   }, [user]);

//   const login = async (email: string, password: string) => {
//     const res = await authApi.login({ email, password });
//     if (res.success) {
//       setUser(res.data.user);
//       setToken(res.data.token);
//       localStorage.setItem('elba_token', res.data.token);
//       localStorage.setItem('elba_user', JSON.stringify(res.data.user));
//     }
//     return { success: res.success, message: res.message };
//   };

//   const register = async (data: any) => {
//     const res = await authApi.register(data);
//     if (res.success) {
//       setUser(res.data.user);
//       setToken(res.data.token);
//       localStorage.setItem('elba_token', res.data.token);
//       localStorage.setItem('elba_user', JSON.stringify(res.data.user));
//     }
//     return { success: res.success, message: res.message };
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('elba_token');
//     localStorage.removeItem('elba_user');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
//     isWarehouse: user?.role === 'warehouse_operator' || user?.role === 'admin' || user?.role === 'super_admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }






















































// // client/context/authContext.tsx
// 'use client';

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { authApi } from '@/lib/api';

// interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   email: string;
//   phone: string;
//   role: string;
//   verificationTier: string;
//   isAdmin: boolean;
//   adminLevel?: number;
//   adminPermissions?: any;
//   warehouseOperatorProfile?: {
//     _id: string;
//     name: string;
//     code: string;
//     location: { state: string };
//   };
//   farmerProfile?: any;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
//   register: (data: any) => Promise<{ success: boolean; message: string }>;
//   logout: () => void;
//   isAuthenticated: boolean;
//   isAdmin: boolean;
//   isWarehouse: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check for stored token on mount
//     const storedToken = localStorage.getItem('elba_token');
//     if (storedToken) {
//       setToken(storedToken);
//       authApi.getMe(storedToken)
//         .then((res) => {
//           if (res.success) {
//             setUser(res.data.user);
//           } else {
//             localStorage.removeItem('elba_token');
//             setToken(null);
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem('elba_token');
//           setToken(null);
//         })
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email: string, password: string) => {
//     const res = await authApi.login({ email, password });
//     if (res.success) {
//       setUser(res.data.user);
//       setToken(res.data.token);
//       localStorage.setItem('elba_token', res.data.token);
//     }
//     return { success: res.success, message: res.message };
//   };

//   const register = async (data: any) => {
//     const res = await authApi.register(data);
//     if (res.success) {
//       setUser(res.data.user);
//       setToken(res.data.token);
//       localStorage.setItem('elba_token', res.data.token);
//     }
//     return { success: res.success, message: res.message };
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem('elba_token');
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//     // isAdmin: user?.isAdmin || false,
//     isAdmin: user?.role === 'admin' || user?.role === 'super_admin',
//     isWarehouse: user?.role === 'warehouse_operator' || user?.role === 'admin' || user?.role === 'super_admin',
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }