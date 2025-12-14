// https://nuxt.com/docs/api/configuration/nuxt-config
//lakuin ini
// npm install -D @types/node
import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/global.css"],
  alias: {
    images: fileURLToPath(new URL("./assets/images", import.meta.url)),
    style: fileURLToPath(new URL("./assets/style", import.meta.url)),
    mockData: fileURLToPath(new URL("./mock-backend/data", import.meta.url)),
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api',
      authApiUrl: process.env.NUXT_PUBLIC_AUTH_API_URL || 'https://aksara-api.fruz.xyz/api'
    }
  },
  // Configure proxy for auth API in development
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: 'https://aksara-api.fruz.xyz/api/**'
      }
    }
  }
});
