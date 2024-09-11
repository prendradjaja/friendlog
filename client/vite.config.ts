import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:2201",
      "/login": "http://localhost:2201",
      "/logout": "http://localhost:2201",
      "/oauth2": "http://localhost:2201",
    },
    port: 2200,
    strictPort: true,
  },
});
