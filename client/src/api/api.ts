import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";

interface RefreshResponse {
  data: {
    token: string;
  };
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface QueuedRequest {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

function getUrl() {
  if (import.meta.env.VITE_API_URL)
    return `${import.meta.env.VITE_API_URL}/api`;
  return "http://localhost:3000/api";
}

const api = axios.create({
  baseURL: getUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed for refresh cookie
});

// request interceptor
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// refresh logic
let isRefreshing = false;
let queue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
};

// response interceptor
api.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as RetryableRequestConfig;

    if (
      err.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh") ||
      originalRequest.url?.includes("/auth/login")
    ) {
      return Promise.reject(err);
    }

    originalRequest._retry = true;

    // If refresh already running → queue request
    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const res = await api.get<RefreshResponse>("/auth/refresh", {
        withCredentials: true,
      } as AxiosRequestConfig);
      const newToken = res.data.data.token;

      // update store
      const { user } = useAuthStore.getState();

      if (user) {
        useAuthStore.getState().setAuth(user, newToken);
      } else {
        useAuthStore.getState().setToken(newToken);
      }

      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (error) {
      processQueue(error, null);
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);

console.log(api.defaults.baseURL);

export default api;
