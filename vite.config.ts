import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      // Path alias for cleaner imports: @/components instead of ../../../components
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize chunk size and code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks to leverage browser caching
          // React ecosystem - frequently updated but stable API
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Firebase - large library, good to isolate
          'vendor-firebase': ['firebase'],
          // OpenAI - external API client, stable
          'vendor-openai': ['openai'],
          // Icons - large icon library, good to isolate
          'vendor-icons': ['react-icons'],
        },
      },
    },
    // Increase chunk size warning limit since we have large dependencies
    // Firebase and OpenAI are particularly large
    chunkSizeWarningLimit: 600,
  },
})
