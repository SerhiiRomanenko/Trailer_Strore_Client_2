import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react"; // Додайте цей імпорт

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  return {
    plugins: [react()], // Додайте плагін React, якщо його ще немає
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },
    server: {
      // <--- Додано блок server для налаштування проксі
      proxy: {
        "/api": {
          // Всі запити, що починаються з '/api'
          // target: "http://localhost:5000", // Перенаправляємо на ваш бекенд
          target: "https://trailer-strore-server.onrender.com", // Перенаправляємо на ваш бекенд
          changeOrigin: true, // Змінює заголовок Host на target URL
          secure: false, // Встановіть true, якщо ваш бекенд використовує HTTPS
        },
      },
    },
  };
});
