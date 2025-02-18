import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      "/api/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/user/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/post/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/story/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/reel/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/chat/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
