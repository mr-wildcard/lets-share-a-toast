const { build } = require("esbuild");

build({
  entryPoints: ["src/index.ts"],
  platform: "node",
  outfile: "lib/index.js",
  bundle: true,
  external: ["firebase-admin", "firebase-functions"],
  watch: true,
});
