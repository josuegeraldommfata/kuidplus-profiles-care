import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import api from '@/lib/api';
import { User } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('kuid_token');
    if (token) {
      // Verify token and get user data
      api.get('/api/auth/me')
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('kuid_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Resposta inválida do servidor');
      }

      localStorage.setItem('kuid_token', token);
      setUser(userData);

      return {
        success: true,
        message: 'Login realizado com sucesso!',
        user: userData
      };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      const errorMessage = error.response?.data?.error || error.message || 'Erro ao fazer login. Verifique suas credenciais.';

      return {
        success: false,
        message: errorMessage
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kuid_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Em desenvolvimento, apenas logar o erro em vez de quebrar
    if (process.env.NODE_ENV === 'development') {
      console.warn('useAuth called outside AuthProvider. Make sure AuthProvider wraps your app.');
      // Retornar valores padrão para evitar crash durante hot reload
      return {
        user: null,
        login: async () => ({ success: false, message: 'AuthProvider não encontrado' }),
        logout: () => {},
        isAuthenticated: false,
        loading: false,
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
