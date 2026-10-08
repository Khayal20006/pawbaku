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
      // Dev flow runs the backend from IntelliJ (:8080) so its console shows live logs;
      // application-local.yml gives that process the same DB/SMTP/CORS as the compose stack.
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
      '/uploads': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})