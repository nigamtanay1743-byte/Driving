import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let csrfToken = '';

export function setCsrfToken(token) {
  csrfToken = token || '';
}

export async function ensureCsrfToken() {
  if (csrfToken) return csrfToken;
  const { data } = await api.get('/auth/csrf-token');
  csrfToken = data.csrfToken;
  return csrfToken;
}

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase();
  if (['post', 'put', 'patch', 'delete'].includes(method) && config.url?.startsWith('/admin')) {
    const token = await ensureCsrfToken();
    config.headers['x-csrf-token'] = token;
  }
  if (method === 'post' && config.url === '/auth/login') {
    const token = await ensureCsrfToken();
    config.headers['x-csrf-token'] = token;
  }
  return config;
});

export default api;
