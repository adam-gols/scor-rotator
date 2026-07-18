# Snippet: add to vite.config.ts when using a 1Password-mounted .env
# Prevents infinite dev-server restarts (Vite watches .env by default).
#
# See docs/1password-guided-setup.md#vite--hot-reload-projects

import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/.env'],
    },
  },
})
