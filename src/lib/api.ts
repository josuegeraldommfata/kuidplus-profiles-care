import axios from 'axios';

// Determina a base URL da API
// Em produção (VPS), usa o domínio completo
// Em desenvolvimento, usa proxy do Vite
const getApiBaseUrl = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    return '';
  }

  return 'https://kuiddmais.com.br';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// 👉 Interceptor de request
// ⚠️ NÃO DEFINIR Content-Type AQUI
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kuid_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 👉 Interceptor de response (401 e 402)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('kuid_token');

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 402 && error.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
      // Redirect to plans page for subscription required
      window.location.href = '/planos/contratante';
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
