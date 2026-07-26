import { createContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { authService } from '@services/authService';
import { setAuthToken } from '@services/api';

export const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      try {
        const res = await authService.getMe();
        if (!cancelled) setUser(res.data.user);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    setAuthToken(res.data.token);
    setUser(res.data.user);
    toast.success(`Welcome to CarVault, ${res.data.user.name.split(' ')[0]}!`);
    return res.data.user;
  }, []);

  const login = useCallback(async (payload) => {
    const res = await authService.login(payload);
    setAuthToken(res.data.token);
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name.split(' ')[0]}!`);
    return res.data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setAuthToken(null);
      setUser(null);
      toast.success('Logged out successfully');
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    const res = await authService.updateProfile(payload);
    setUser(res.data.user);
    toast.success('Profile updated successfully');
    return res.data.user;
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isLoading,
    register,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}