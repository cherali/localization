import { defineConfig } from "vitest/config";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import eslint from "vite-plugin-eslint";
import esbuild from "rollup-plugin-esbuild";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({}),
    eslint(),
    esbuild({
      minify: true,
      legalComments: "none",
    }),
  ],
  build: {
    lib: {
      entry: {
        server: resolve(__dirname, "src/providers/server/index.ts"),
        client: resolve(__dirname, "src/providers/client/index.ts"),
      },
    },

    rollupOptions: {
      input: {
        server: resolve(__dirname, "src/providers/server/index.ts"),
        client: resolve(__dirname, "src/providers/client/index.ts"),
      },
      output: [
        {
          format: "cjs",
          entryFileNames: "[name].cjs",
          chunkFileNames: "shared.cjs",
          assetFileNames: "[name]-[ext]",
          dir: "dist/cjs",
        },
        {
          format: "es",
          entryFileNames: "[name].js",
          chunkFileNames: "shared.js",
          assetFileNames: "[name]-[ext]",
          dir: "dist/es",
        },
      ],
      external: ["fs", "path"],
    },
  },
  test: {
    coverage: {
      provider: "istanbul",
      include: ["src/utils/**", "src/providers/**"],
    },
  },
});
