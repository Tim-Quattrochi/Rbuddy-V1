import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "icon.svg",
        "apple-touch-icon-180x180.png",
        "pwa-*.png",
        "maskable-icon-*.png",
        "logo-*.png",
        "nm-logo*.png",
      ],
      manifest: {
        name: "Next Moment",
        short_name: "Next Moment",
        description: "Daily recovery support ritual for your reentry journey",
        theme_color: "#1a202e",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png"
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
        categories: ["health", "lifestyle"],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        // Do NOT serve index.html for API or auth navigations (let serverless endpoints handle them)
        navigateFallbackDenylist: [/^\/api\//, /^\/api\/auth\//, /^\/auth\//],
        runtimeCaching: [
          {
            // Cache-first strategy for static assets
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache-first for font files
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "gstatic-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          // API routes are NOT handled by service worker at all
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      // since root is client, @ points to client/src
      '@api': path.resolve(__dirname,  'api'),
      '@components': path.resolve(__dirname, 'client', 'src', 'components'),
      '@': path.resolve(__dirname, 'client', 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
      '@assets': path.resolve(__dirname, 'attached_assets')
    }
  },
  root: path.resolve(__dirname, "client"),
  publicDir: path.resolve(__dirname, "client/public"),
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true
  },
  server: {
    proxy: {
      "/api": {
        target: process.env.NODE_ENV === "production" ? "https://rbuddy-v1.vercel.app" : "http://localhost:5001",
        changeOrigin: true,
        secure: false
      },
    }
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
});




