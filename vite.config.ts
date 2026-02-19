import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(() => {

  return {
    plugins: [react(), tailwindcss()],
    envDir: "./environments",
    resolve: {
      alias: { "@": "/src" },
    },
    base: "/onboarding",
    build: {
      sourcemap: true,
    },
  };
});