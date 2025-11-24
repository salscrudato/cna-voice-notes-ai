import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    // Optimize chunk size and code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase'],
          'vendor-openai': ['openai'],
          'vendor-icons': ['react-icons'],
        },
      },
    },
    // Increase chunk size warning limit since we have large dependencies
    chunkSizeWarningLimit: 600,
  },
})
