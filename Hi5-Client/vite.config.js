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
      "/profileImage/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/coverImage/": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
