import { context } from "esbuild";

const args = process.argv.slice(2);

context({
  entryPoints: ["src/index.ts"],
  platform: "node",
  target: ["node22"],
  outfile: "build/index.js",
  bundle: true,
  absWorkingDir: import.meta.dirname,
  external: ["firebase-admin", "firebase-functions"],
}).then((bundler) => {
  console.log("✅ Compilation for Firebase functions ready.");

  if (args.includes("--watch")) {
    console.log("Watching for changes...");

    return bundler.watch();
  }
});
