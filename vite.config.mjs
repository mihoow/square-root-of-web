import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { vercelPreset } from '@vercel/remix/vite'

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      tailwind: true,
      postcss: true,
      presets: [vercelPreset()]
      // appDirectory: "app",
      // assetsBuildDirectory: "public/build",
      // publicPath: "/build/",
      // serverBuildPath: "build/index.js",
    }),
    tsconfigPaths(),
  ],
  logLevel: "warn",
});
