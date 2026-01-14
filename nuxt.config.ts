// https://nuxt.com/docs/api/configuration/nuxt-config
//lakuin ini
// npm install -D @types/node
import { fileURLToPath } from "node:url";

const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api'
const externalApiUrl = (process.env.NUXT_PUBLIC_EXTERNAL_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
const embedApiUrl = process.env.NUXT_PUBLIC_EMBED_API_URL || apiBaseUrl

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/global.css"],
  app: {
    head: {
      title: "Aksara | Window to the World",
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg?v=1" },
        { rel: "shortcut icon", href: "/favicon.svg?v=1" }
      ]
    }
  },
  alias: {
    images: fileURLToPath(new URL("./assets/images", import.meta.url)),
    style: fileURLToPath(new URL("./assets/style", import.meta.url)),
    mockData: fileURLToPath(new URL("./mock-backend/data", import.meta.url)),
  },
  runtimeConfig: {
    public: {
      apiBaseUrl,
      externalApiUrl,
      embedApiUrl
    }
  },
  // Configure proxy for external APIs in development to bypass CORS
  nitro: {
    routeRules: {
      '/api/auth/**': {
        proxy: `${externalApiUrl}/auth/**`
      }
    }
  }
});
