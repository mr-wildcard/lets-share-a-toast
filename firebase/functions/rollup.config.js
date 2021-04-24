import * as path from "path";
import sucrase from "@rollup/plugin-sucrase";
import typescript from "@rollup/plugin-typescript";
import includePaths from "rollup-plugin-includepaths";
import resolve from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "cjs",
  },
  external: ["firebase-functions", "firebase-admin"],
  plugins: [
    typescript({
      include: ["./**/*.ts", "../../shared/**/*.ts"],
    }),
  ],
};
