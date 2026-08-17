import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        /*
         * Framework code changes far less often than site content. Splitting it
         * out means a copy tweak invalidates only the small app chunk, not the
         * ~400KB of vendor code alongside it.
         */
        manualChunks: (id: string) => {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('framer-motion') || id.includes('motion-dom')) return 'motion'
          if (id.includes('react-router')) return 'router'
          if (id.includes('/react/') || id.includes('/react-dom/')) return 'react'
          return undefined
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    // Animated components make user-event interactions slower than the 5s
    // default allows on a cold run.
    testTimeout: 20000,
  },
})
