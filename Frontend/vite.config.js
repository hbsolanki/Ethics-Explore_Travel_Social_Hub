import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/API": "http://0.0.0.0:8000",
    },
  },
  plugins: [react()],
});
