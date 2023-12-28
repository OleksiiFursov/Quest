import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: 'build',
    assetsDir: 'public',
    sourcemap: true,
    minify: 'terser',
    chunkSizeWarningLimit: 1000000,
    rollupOptions: {
      output: {
        manualChunks (id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
