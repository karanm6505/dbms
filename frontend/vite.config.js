import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), "");
    var proxyTarget = env.VITE_API_BASE_URL || "http://localhost:5050";
    var shouldProxy = env.VITE_USE_PROXY !== "false";
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
