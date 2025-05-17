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
    proxy: {
      '/php': {
        target: 'http://localhost',
        changeOrigin: true,
        secure: false,
        ws: true,
        cookieDomainRewrite: '',
        rewrite: path => path.replace(/^\/php/, '/track-learn/php_scripts')
      }
    }
  }
});
