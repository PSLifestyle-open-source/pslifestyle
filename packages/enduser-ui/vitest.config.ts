import viteConfig from "./vite.config";
import { defineConfig, mergeConfig } from "vitest/config";

export default defineConfig((configEnv) =>
  mergeConfig(
    viteConfig(configEnv),
    defineConfig({
      test: {
        environment: "happy-dom",
        globals: true,
        mockReset: true,
        setupFiles: "src/setupTests.ts",
      },
      resolve: {
        alias: {
          "./customLocalStorageDetection":
            "../../__mocks__/i18n/customLocalStorageDetection",
        },
      },
    }),
  ),
);
