import axios from 'axios';

// Normalize baseURL so it always targets /api/v1 regardless of formatting
const rawBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || '/api/v1';
const baseURL = rawBase.endsWith('/api/v1')
  ? rawBase
  : `${rawBase.replace(/\/+$/, '')}/api/v1`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000
});

let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

api.interceptors.request.use(config => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    const original = error.config as (typeof error.config & {_retried?: boolean});
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !String(original.url).includes('/auth/refresh') &&
      !String(original.url).includes('/auth/login')
    ) {
      original._retried = true;
      try {
        refreshPromise ??= api
          .post('/auth/refresh')
          .then(r => {
            const t = r.data.data.accessToken as string;
            setAccessToken(t);
            return t;
          })
          .catch(() => {
            setAccessToken(null);
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });

        const token = await refreshPromise;
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        }
      } catch {
        /* fall through to rejection */
      }
    }
    return Promise.reject(error);
  }
);

export function messageOf(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const e = error as {
      response?: {
        data?: {
          error?: {
            message?: string;
            code?: string;
          };
          message?: string;
        };
      };
    };
    return (
      e.response?.data?.error?.message ||
      e.response?.data?.message ||
      'Request failed. Please try again.'
    );
  }
  return error instanceof Error ? error.message : 'Something went wrong.';
}
