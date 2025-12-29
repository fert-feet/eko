import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    server: {
        open: "demo.html"
    },
    build: {
        lib: {
            entry: resolve(__dirname, "embed.ts"),
            name: "widget",
            fileName: "widget",
            formats: ["iife"],
        },
        rollupOptions: {
            output: {
                extend: true,
            }
        }
    },
});