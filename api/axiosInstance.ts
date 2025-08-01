// src/api/axiosInstance.ts
import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://trailer-strore-server.onrender.com/api";

// Створюємо екземпляр Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Додаємо інтерцептор запитів
// Цей інтерцептор буде виконуватися перед кожним запитом,
// дозволяючи нам додати токен авторизації, якщо він існує.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Отримуємо токен з localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Додаємо токен до заголовка Authorization
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
