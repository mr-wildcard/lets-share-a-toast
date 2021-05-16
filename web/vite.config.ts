import { resolve } from "path";
import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { visualizer } from "rollup-plugin-visualizer";

Object.entries(process.env).forEach(([key, value]) => {
  if (key.startsWith("VITE_")) {
    console.log(`${key}: ${value}`);
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: resolve(__dirname, "..", "firebase", "dist"),
  },
  plugins: [reactRefresh(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@shared": resolve(__dirname, "..", "shared"),
      "@web": resolve(__dirname, "src"),
    },
  },
});
