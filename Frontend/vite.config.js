import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/API": "https://ethics-explore-travel-social-hub.onrender.com/",
    },
  },
  plugins: [react()],
});
