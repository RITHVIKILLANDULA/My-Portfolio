import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages serves the project under /My-Portfolio/; dev serves at root.
  base: command === 'build' ? '/My-Portfolio/' : '/',
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['framer-motion'],
          vendor: ['react', 'react-dom', 'react-icons'],
        },
      },
    },
  },
}))
