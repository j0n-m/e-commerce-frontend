/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup/vitest.setup.ts"],
  },
});
