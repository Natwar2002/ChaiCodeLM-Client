import { defineConfig } from "vite";
import path from "path";

// Client build configuration
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
});