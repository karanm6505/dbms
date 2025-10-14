import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget = env.VITE_API_BASE_URL || "http://localhost:5050";
  const shouldProxy = env.VITE_USE_PROXY !== "false";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
      proxy: shouldProxy
        ? {
            "/api": {
              target: proxyTarget,
              changeOrigin: true,
            },
          }
        : undefined,
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
