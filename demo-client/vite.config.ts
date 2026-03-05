import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = (env.VITE_API_BASE_URL || "http://localhost:3999").replace(/\/+$/, "");

  return {
    plugins: [react()],
    server: {
      strictPort: true,
      proxy: {
        "/.netlify/functions": {
          target,
          changeOrigin: true
        }
      }
    }
  };
});
