import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import api from '@/lib/api';
import { User } from '@/data/mockData';



// Extend User type for subscription fields
declare module '@/data/mockData' {
  interface User {
    trial_ends_at?: string | null;
    subscription_status?: string | null;
    plan_type?: string | null;
  }
}
import { getFileUrl } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  updateUser: (data: Partial<User>) => void;
  checkSubscriptionStatus: () => {
    needsUpgrade: boolean;
    daysLeft: number;
    planRequired: string;
  } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Normaliza usuário (profile_image / profileImage)
  const normalizeUser = (u: any): User | null => {
    if (!u) return null;
    const profile_image = u.profile_image || u.profileImage || null;

    return {
      ...u,
      profile_image,
      profileImage: profile_image ? getFileUrl(profile_image) : null,
    } as User;
  };

  // Verifica token ao iniciar
  useEffect(() => {
    const token = localStorage.getItem('kuid_token');

    if (token) {
      api
        .get('/api/auth/me')
        .then((response) => {
          setUser(normalizeUser(response.data.user));
        })
        .catch(() => {
          localStorage.removeItem('kuid_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Auto-save geolocation quando user logado
  useEffect(() => {
    if (!user || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          await api.patch('/api/profile/location', {
            latitude,
            longitude,
            cidade: user.cidade || '',
            estado: user.estado || ''
          });

          // Update local user
          updateUser({ latitude, longitude });

          console.log('📍 Localização salva:', latitude, longitude);
        } catch (error) {
          console.warn('Erro salvar localização:', error);
        }
      },
      (error) => {
        console.warn('Geolocation negada:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000 // 5min cache
      }
    );
  }, [user]);


  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      if (!token || !userData) {
        throw new Error('Resposta inválida do servidor');
      }

      localStorage.setItem('kuid_token', token);
      setUser(normalizeUser(userData));

      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.error ||
          error.message ||
          'Erro ao fazer login',
      };
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return normalizeUser(data as any);

      const merged: any = { ...prev, ...data };
      merged.profile_image =
        merged.profile_image || merged.profileImage || null;
      merged.profileImage = merged.profile_image
        ? getFileUrl(merged.profile_image)
        : null;

      return merged as User;
    });
  };

  const checkSubscriptionStatus = () => {
    if (!user) {
      return { needsUpgrade: false, daysLeft: 0, planRequired: '' };
    }

    const now = new Date();
    const trialEndsAt = user.trial_ends_at
      ? new Date(user.trial_ends_at)
      : null;

    // Se tem assinatura ativa, nunca precisa de upgrade
    if (user.subscription_status === 'active') {
      return { needsUpgrade: false, daysLeft: 0, planRequired: '' };
    }

    let daysLeft = 0;
    if (trialEndsAt) {
      daysLeft = Math.ceil(
        (trialEndsAt.getTime() - now.getTime()) /
          (1000 * 60 * 60 * 24)
      );
    }

    // Se está no trial e ainda tem dias restantes, NÃO precisa de upgrade
    if (user.subscription_status === 'trial' && daysLeft > 0) {
      return { needsUpgrade: false, daysLeft, planRequired: '' };
    }

    // Só precisa de upgrade se: trial expirou OU status é 'expired'
    let needsUpgrade = false;
    let planRequired = '';

    const trialExpired = user.subscription_status === 'trial' && daysLeft <= 0;
    const isExpired = user.subscription_status === 'expired';

    if (trialExpired || isExpired) {
      needsUpgrade = true;
      planRequired = user.role === 'contratante'
        ? 'Contratante (Familiar)'
        : 'Mensal ou Trimestral';
    }

    return {
      needsUpgrade,
      daysLeft: Math.max(0, daysLeft),
      planRequired,
    };
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
        updateUser,
        checkSubscriptionStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    if (import.meta.env.DEV) {
      console.warn(
        'useAuth chamado fora do AuthProvider'
      );
      return {
        user: null,
        login: async () => ({
          success: false,
          message: 'AuthProvider não encontrado',
        }),
        logout: () => {},
        isAuthenticated: false,
        loading: false,
        updateUser: () => {},
        checkSubscriptionStatus: () => null,
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}



