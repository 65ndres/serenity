// src/context/AuthContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios, { AxiosError } from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
// import * as InAppPurchases from 'react-native-iap';

interface User {
  token: string;
  email?: string;
  id?: number;
  subscriptionStatus?: string; // e.g., 'active', 'canceled'
}

interface AuthStackParamList {
  Login: undefined;
  SignUp: undefined;
  PasswordReset: undefined;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  subscribe: (planId: string, processor: 'apple' | 'google' | 'stripe') => Promise<void>;
  checkSubscription: () => Promise<string>;
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
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const API_URL = 'http://127.0.0.1:3000/api/v1';

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`${API_URL}/subscriptions/active`);
          setUser({ token, subscriptionStatus: response.data.status });
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
      const subResponse = await axios.get(`${API_URL}/subscriptions/active`);
      setUser({ token, ...response.data.user, subscriptionStatus: subResponse.data.status });
      return true;
    } catch (e: unknown) {
      console.error('Login failed', e);
      return false;
    }
  };

  const signup = async (email: string, password: string, passwordConfirmation: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await axios.post<{ token: string; user: { id: number; email: string } }>(
        `${API_URL}/auth/signup`,
        { email, password, password_confirmation: passwordConfirmation }
      );
      const { token } = response.data;
      await AsyncStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ token, ...response.data.user });
      return { success: true };
    } catch (e: unknown) {
      const error = e as AxiosError<{ errors?: string[] }>;
      console.error('Signup failed', error);
      return { success: false, error: error.response?.data?.errors?.join(', ') || 'Signup failed' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log('Logout token:', token); // Debug
      if (token) {
        await axios.delete(`${API_URL}/auth/logout`, { headers: { Authorization: `Bearer ${token}` } });
      }
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigation.replace('Login');
    } catch (e: unknown) {
      const error = e as AxiosError<{ error?: string }>;
      console.error('Logout failed', error);
      await AsyncStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigation.replace('Login'); // Navigate to Login on any error
      if (error.response?.status !== 401) {
        Alert.alert('Error', error.response?.data?.error || 'Logout failed. Please try again.');
      }
    }
  };

  const subscribe = async (planId: string, processor: 'apple' | 'google' | 'stripe'): Promise<void> => {
    try {
      if (processor === 'apple' || processor === 'google') {
        const plan = await axios.get(`${API_URL}/plans/${planId}`).then(res => res.data);
        const productId = processor === 'apple' ? plan.apple_product_id : plan.google_product_id;
        // await InAppPurchases.initConnection();
        const products = []//await InAppPurchases.getProducts([productId]);
        if (products.length) {
          const purchase = ''//await InAppPurchases.requestPurchase(productId);
          await axios.post(`${API_URL}/subscriptions`, {
            plan_id: planId,
            processor,
            [processor === 'apple' ? 'receipt' : 'purchase_token']: "purchase.transactionId" || "purchase.purchaseToken"
          });
          const subResponse = await axios.get(`${API_URL}/subscriptions/active`);
          setUser({ ...user!, subscriptionStatus: subResponse.data.status });
        }
      } else if (processor === 'stripe') {
        // Redirect to Stripe Checkout (for web)
        const session = await axios.post(`${API_URL}/subscriptions`, { plan_id: planId, processor }).then(res => res.data);
        // Handle Stripe Checkout redirect in web context
      }
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.error('Subscription failed', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      // await InAppPurchases.endConnection();
    }
  };

  const checkSubscription = async (): Promise<string> => {
    try {
      const response = await axios.get(`${API_URL}/subscriptions/active`);
      setUser({ ...user!, subscriptionStatus: response.data.status });
      return response.data.status;
    } catch (e) {
      console.error('Check subscription failed', e);
      return 'none';
    }
  };

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          await AsyncStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
          setUser(null);
          navigation.replace('Login');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [navigation]);

  const value: AuthContextType = { user, loading, login, signup, logout, subscribe, checkSubscription };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};