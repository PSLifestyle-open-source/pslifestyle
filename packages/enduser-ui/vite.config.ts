import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  console.log(`Mode: ${mode}`);
  console.log(`NODE_ENV=${env.NODE_ENV}`);
  console.log(`VITE_USE_EMULATOR=${env.VITE_USE_EMULATOR}`);
  return {
    plugins: [
      react(),
      svgr({
        include: "**/*.svg?react",
      }),
    ],
    server: {
      port: 3000,
      watch: {
        ignored: ["**/cypress/**"],
      },
    },
    build: {
      assetsInlineLimit: 0,
      sourcemap: mode === "development" || env.NODE_ENV === "development",
    },
  };
});
