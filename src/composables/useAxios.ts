import axios, { AxiosError } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from '../stores/auth';
const baseURL = import.meta.env.VITE_API_URL // ambil dari .env
const REFRESH_TOKEN_URL = `${baseURL}/auth/refresh-token`;

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: string | null) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}
export function isAxiosError(err: unknown): err is AxiosError<{ message?: string }> {
  return typeof err === 'object' && err !== null && 'isAxiosError' in err
}
export function useAxios(): AxiosInstance {
  const authStore = useAuthStore();

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // ambil dari .env
    timeout: 10000,
  });

  // Request Interceptor
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = authStore.token.value;
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (originalRequest.headers && token) {
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
              }
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }
        originalRequest._retry = true;
        isRefreshing = true;
        try {
          // Ganti dengan cara Anda mendapatkan refresh token
          const refreshToken = localStorage.getItem('refresh_token');
          const token = authStore.token.value;
          if (!refreshToken) throw new Error('No refresh token');
          const { data } = await axios.post(REFRESH_TOKEN_URL, { refresh_token:refreshToken },{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const newToken = data.token;
          const { updateToken } = useAuthStore();
          updateToken(newToken)
          // Tidak bisa assign ke readonly, update lewat localStorage saja (store akan sync di reload)
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          }
          processQueue(null, newToken);
          return instance(originalRequest);
        } catch (err) {
          processQueue(err as unknown, null);
          authStore.logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
}
