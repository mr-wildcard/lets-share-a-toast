const { build } = require("esbuild");

const args = process.argv.slice(2);

build({
  entryPoints: ["src/index.ts"],
  platform: "node",
  target: ["node16"],
  outfile: "lib/index.js",
  bundle: true,
  watch: args.includes("--watch"),
  external: ["firebase-admin", "firebase-functions"],
});
