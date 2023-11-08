import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/server.ts"],
  clean: true,
  format: ["cjs"],
  ...options,
}));
