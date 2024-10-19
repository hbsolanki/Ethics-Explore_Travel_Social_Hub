import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/API": {
        target:
          "https://ethics-explore-travel-social-hub-backend.onrender.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, ""), // Remove /API from the path
      },
    },
  },
  plugins: [react()],
});
