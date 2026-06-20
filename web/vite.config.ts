import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";

// Using import.meta.url to construct __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: { overrides: { removeViewBox: false } },
            },
            {
              name: "inlineStyles",
              params: {
                onlyMatchedOnce: false,
              },
            },
            {
              name: "prefixIds",
              params: {
                prefixIds: true,
              },
            },
          ],
        },
      },
    }),
    react(),
  ],
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      "@global": path.resolve(__dirname, "src/global"),
      "@common": path.resolve(__dirname, "src/_common"),
      "@data": path.resolve(__dirname, "src/data"),
      "@services": path.resolve(__dirname, "src/services"),
      "@public": path.resolve(__dirname, "public"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@tabler/icons-react": "@tabler/icons-react/dist/esm/icons/index.mjs", // Adjust to fix chunck problem with tabler icons https://github.com/tabler/tabler-icons/issues/1233#issuecomment-2428245119
    },
  },
  build: {
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router"],
          mantine: [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/carousel",
            "@mantine/notifications",
          ],
        },
      },
    },
  },
});
