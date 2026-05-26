import { defineConfig } from "tsup";
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

async function copyAsset(from: string, to: string) {
  const dest = resolve(to);
  await mkdir(dirname(dest), { recursive: true });
  await copyFile(resolve(from), dest);
}

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.css"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: false,
  target: "es2020",
  external: ["react", "react-dom", "react/jsx-runtime"],
  // 1:1 file output so Next.js App Router consumers preserve the
  // `"use client"` / `"use server"` directives declared in individual
  // component source files.
  bundle: false,
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" };
  },
  async onSuccess() {
    // Copy raw CSS assets into the dist tree alongside the JS bundles so that
    // `@viax/uxm/ui.css` and `@viax/uxm/tokens.css` exports resolve correctly.
    await copyAsset("src/ui/styles.css", "dist/ui/styles.css");
    await copyAsset("src/tokens/index.css", "dist/tokens/index.css");
  },
});
