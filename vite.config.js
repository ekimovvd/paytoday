import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/styles/main.scss"),
      },
      output: {
        assetFileNames: "assets/[name][extname]",
      },
    },
    outDir: "dist",
    assetsDir: "",
    emptyOutDir: false,
  },
  server: {
    open: false,
  },
});
