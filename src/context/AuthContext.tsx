import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../lib/graphql';
import { User, UserRole } from '../types';
import { client } from '../lib/apollo';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [registerMutation] = useMutation(REGISTER_MUTATION);

  useEffect(() => {
    const storedToken = localStorage.getItem('tms_token');
    const storedUser = localStorage.getItem('tms_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await loginMutation({
      variables: { input: { email, password } },
    });

    const { token: newToken, user: newUser } = data.login;
    localStorage.setItem('tms_token', newToken);
    localStorage.setItem('tms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, [loginMutation]);

  const register = useCallback(async (registerData: RegisterData) => {
    const { data } = await registerMutation({
      variables: { input: registerData },
    });

    const { token: newToken, user: newUser } = data.register;
    localStorage.setItem('tms_token', newToken);
    localStorage.setItem('tms_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }, [registerMutation]);

  const logout = useCallback(() => {
    localStorage.removeItem('tms_token');
    localStorage.removeItem('tms_user');
    setToken(null);
    setUser(null);
    client.clearStore();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === UserRole.ADMIN,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

