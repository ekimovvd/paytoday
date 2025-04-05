import { defineConfig } from "vite";
import { resolve } from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  root: "./",
  build: {
    rollupOptions: {
      input: {
        style: resolve(__dirname, "src/styles/main.scss"),
      },
      output: {
        assetFileNames: "styles/[name][extname]",
      },
    },
    outDir: "dist",
    assetsDir: "",
    emptyOutDir: true,
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: "assets", dest: "" },
        { src: "components/*", dest: "components" },
        { src: "static-data/*", dest: "static-data" },
        { src: "*.html", dest: "" },
        { src: "js/**/*", dest: "js" },
      ],
    }),
  ],
});
