import { join, resolve } from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";

Object.entries(process.env).forEach(([key, value]) => {
  if (key.startsWith("VITE_")) {
    console.log(`${key}: ${value}`);
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "..", "shared"),
      "@web": resolve(__dirname, "src"),
    },
  },
});
