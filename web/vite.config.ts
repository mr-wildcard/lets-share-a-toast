import { resolve } from "path";
import { ConfigEnv } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import { visualizer } from "rollup-plugin-visualizer";

Object.entries(process.env).forEach(([key, value]) => {
  if (key.startsWith("VITE_")) {
    console.log(`${key}: ${value}`);
  }
});

const aliases = {
  "@shared": resolve(__dirname, "..", "shared"),
  "@web": resolve(__dirname, "src"),
};

export default function getConfig({ command }: ConfigEnv) {
  if (command === "serve") {
    return {
      plugins: [reactRefresh()],
      resolve: {
        alias: aliases,
      },
    };
  }

  return {
    build: {
      outDir: resolve(__dirname, "..", "firebase", "dist"),
    },
    plugins: [visualizer({ open: true })],
    resolve: {
      alias: aliases,
    },
  };
}
