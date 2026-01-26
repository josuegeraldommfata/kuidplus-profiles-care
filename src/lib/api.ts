import axios from 'axios';

// Determina a base URL da API
// Em produção (VPS), usa o domínio completo
// Em desenvolvimento, usa proxy do Vite
const getApiBaseUrl = () => {
  // Se está rodando em localhost, usa o proxy do Vite
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return '';
  }
  // Em produção, usa a URL da API no VPS
  return 'https://kuiddmais.com.br';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('kuid_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('kuid_token');
      // Redirecionar para login se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
