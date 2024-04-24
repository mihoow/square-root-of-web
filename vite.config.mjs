import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { defineConfig } from 'vite';
import { vitePlugin as remix } from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [
        remix({
            ignoredRouteFiles: ['**/.*'],
            tailwind: true,
            postcss: true,
            // appDirectory: "app",
            // assetsBuildDirectory: "public/build",
            // publicPath: "/build/",
            // serverBuildPath: "build/index.js",
        }),
        tsconfigPaths(),
    ],
    logLevel: 'warn',
    ssr: {
        noExternal: [
            'remix-utils',
            "is-ip",
            "ip-regex",
            "super-regex",
            "clone-regexp",
            "function-timeout",
            "time-span",
            "convert-hrtime",
            "is-regexp"
        ],
    },
    optimizeDeps: {
        esbuildOptions: {
            define: {
                global: 'globalThis',
            },
            plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
        },
    },
});
