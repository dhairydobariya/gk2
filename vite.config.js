import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/gk2/' : '/',
  plugins: [react()],
  build: {
    outDir: process.env.GITHUB_PAGES === 'true' ? 'docs' : 'dist',
    cssCodeSplit: false,
    // Minify with esbuild (default, fastest)
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split chunks aggressively to reduce initial JS payload
        manualChunks(id) {
          // Core React — always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          // Router — needed for navigation
          if (id.includes('node_modules/react-router-dom/') || id.includes('node_modules/react-router/')) {
            return 'router';
          }
          // Admin pages — only loaded when /admin is visited
          if (id.includes('/pages/Admin') || id.includes('/components/Admin') || id.includes('/components/admin/')) {
            return 'admin';
          }
          // Blog pages — only loaded when /blog is visited
          if (id.includes('/pages/Blog') || id.includes('/data/blog')) {
            return 'blog';
          }
          // Remaining node_modules
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
  },
})
