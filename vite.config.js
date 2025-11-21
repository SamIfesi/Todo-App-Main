import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",

      devOptions: {
        enabled: true,
      },

      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg}"],
      },
      manifest: {
        name: "Todo App",
        short_name: "Todo",
        start_url: "/",
        display: "standalone",
        background_color: "#cacde8",
        theme_color: "#d2d3db",
        description:
          "A simple and stylish todo app to manage your tasks efficiently.",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
