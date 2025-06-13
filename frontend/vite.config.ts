import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true
    },
    proxy: {
      '/php': {
        target: 'http://nginx:80',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/php/, '/php_scripts')
      }
    }
  }
});
