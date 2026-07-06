import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // needed for refresh cookie
});

// request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// refresh logic
let isRefreshing = false;
let queue: never[] = [];

const processQueue = (error: never, token: string | null = null) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  queue = [];
};

// response interceptor
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("/auth/refresh") ||
      originalRequest.url.includes("/auth/login")
    ) {
      return Promise.reject(err);
    }

    originalRequest._retry = true;

    // If refresh already running → queue request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const res = await api.get("/auth/refresh", { withCredentials: true });
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

export default api;
