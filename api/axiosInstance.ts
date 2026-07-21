import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_BASE_API_URL || "https://trailer-strore-server.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Attach auth token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global 401 handler — clear stale token
// Also retries on Render cold-start (502/503/timeout)
const MAX_RETRIES = 3;
const RETRY_DELAY = 6000; // 6s between retries — Render spins up in ~50s worst case

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }

    // Retry on cold-start failures
    const isRetriable =
      error.response?.status === 502 ||
      error.response?.status === 503 ||
      error.code === "ECONNABORTED" || // timeout
      !error.response; // network error

    if (isRetriable && error.config && !error.config._retried) {
      error.config._retried = true;
      await new Promise((r) => setTimeout(r, RETRY_DELAY));
      return api.request(error.config);
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default api;
