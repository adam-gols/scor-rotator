import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Relative paths required for Electron file:// packaged loads
  base: './',
  plugins: [react()],
  server: {
    watch: {
      // 1Password-mounted .env can thrash Vite HMR
      ignored: ['**/.env'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
