import { resolve } from "path";
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

// https://vitejs.dev/config/
export default function getConfig(command: string, mode: string) {
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
