import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Leet-Code-AI/',
  build: {
    rollupOptions: {
      external: ['get-nonce']
    }
  }
})