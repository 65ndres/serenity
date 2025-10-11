// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosError } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  token: string;
  email?: string;
  id?: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  liked: boolean;
  favorited: boolean;
  text: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = 'http://127.0.0.1:3000/api/v1'; // Adjust for your environment

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({ token });
        }
      } catch (e) {
        console.error('Failed to load user', e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ token: string; user: { id: number; email: string } }>(
        `${API_URL}/auth/login`,
        { email, password }
      );
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, ...response.data.user });
      return true;
    } catch (e: unknown) {
      console.error('Login failed', e);
      return false;
    }
  };

  const signup = async (email: string, password: string, passwordConfirmation: string): Promise<boolean> => {
    try {
      const response = await axios.post<{ token: string; user: { id: number; email: string } }>(
        `${API_URL}/auth/signup`,
        { email, password, password_confirmation: passwordConfirmation }
      );
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, ...response.data.user });
      return true;
    } catch (e: unknown) {
      console.error('Signup failed', e);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        await axios.delete(`${API_URL}/auth/logout`, { headers: { Authorization: `Bearer ${token}` } });
      }
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (e: unknown) {
      console.error('Logout failed', e);
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  const value: AuthContextType = { user, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};