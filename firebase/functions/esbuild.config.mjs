import { context, build } from "esbuild";

const args = process.argv.slice(2);

const config = {
  entryPoints: ["src/index.ts"],
  platform: "node",
  target: ["node22"],
  outfile: "build/index.js",
  bundle: true,
  absWorkingDir: import.meta.dirname,
  external: ["firebase-admin", "firebase-functions"],
};

if (args.includes("--watch")) {
  const buildContext = await context(config);

  await buildContext.watch();

  console.log("✅ Firebase functions successfully compiled.");
  console.log("👀 Watching for changes...");
} else {
  await build(config);

  console.log("✅ Firebase functions successfully compiled.");
}
