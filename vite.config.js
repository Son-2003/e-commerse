import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      services: path.resolve(__dirname, "src/services"),
      common: path.resolve(__dirname, "src/common"),
      "@redux": path.resolve(__dirname, "src/redux"),
      components: path.resolve(__dirname, "src/components"),
      pages: path.resolve(__dirname, "src/pages"),
    },
  },
  define: {
    global: "window",
  },
});
