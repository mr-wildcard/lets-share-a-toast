const { build } = require("esbuild");

const args = process.argv.slice(2);

build({
  entryPoints: ["src/index.ts"],
  platform: "node",
  target: ["node16"],
  outfile: "build/index.js",
  bundle: true,
  absWorkingDir: __dirname,
  watch: args.includes("--watch"),
  external: ["firebase-admin", "firebase-functions"],
}).then(() => console.log("✅ Compilation for Firebase functions ready."));
