import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: ["bier.gnatzig.eu", "*"],
    proxy: {
      "/auth": "http://localhost:6969",
      "/beer": "http://localhost:6969",
      "/brewery": "http://localhost:6969",
      "/user": "http://localhost:6969",
      "/team": "http://localhost:6969",
      "/season": "http://localhost:6969",
      "/event": "http://localhost:6969",
      "/service": "http://localhost:6969",
      "/userbeer": "http://localhost:6969",
      "/bringbeer": "http://localhost:6969",
    },
  },
});
