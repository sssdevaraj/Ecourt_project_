import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://apis.akshit.net',
        changeOrigin: true, // typically should be true
        secure: false, // <- disable SSL certificate verification
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
