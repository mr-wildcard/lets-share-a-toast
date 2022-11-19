import { resolve } from "path";
import { ConfigEnv } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default function getConfig() {
  return {
    build: {
      outDir: resolve(__dirname, "..", "firebase", "dist"),
      sourcemap: true,
    },
    plugins: [react(), visualizer()],
    resolve: {
      alias: {
        "@shared": resolve(__dirname, "..", "shared"),
        "@web": resolve(__dirname, "src"),
      },
    },
  };
}
