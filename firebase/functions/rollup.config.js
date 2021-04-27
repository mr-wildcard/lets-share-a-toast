import * as path from "path";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  output: {
    dir: "lib",
    format: "cjs",
  },
  external: ["firebase-functions", "firebase-admin"],
  plugins: [typescript()],
};
