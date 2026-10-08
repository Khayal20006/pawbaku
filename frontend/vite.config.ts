import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The dev server proxies API and upload calls to the Spring Boot backend, so the browser
// sees a single origin and CORS never enters the picture in development.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // Point at the compose backend (127.0.0.1:8081) so the dev server shares the same
      // database and real SMTP config; a locally-run backend on 8080 has no mail settings.
      '/api': { target: 'http://localhost:8081', changeOrigin: true },
      '/uploads': { target: 'http://localhost:8081', changeOrigin: true },
    },
  },
})