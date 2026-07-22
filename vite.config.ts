import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { sitemapPlugin } from "./vite-sitemap-plugin";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    sitemapPlugin({
      siteUrl: "https://trailer-strore-client-3.vercel.app",
      apiUrl: "https://trailer-strore-server.onrender.com",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://trailer-strore-server.onrender.com",
        changeOrigin: true,
        secure: false,
        bypass(_req, _res, options) {
          // Don't proxy source file requests
          if (_req.url && /\.(ts|tsx|js|jsx|json|mjs)$/.test(_req.url)) {
            return _req.url;
          }
        },
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          redux: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
});
