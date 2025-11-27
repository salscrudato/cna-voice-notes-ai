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
          // Firebase - using specific submodules for tree-shaking
          'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/storage', 'firebase/analytics'],
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
    // Image optimization settings
    assetsInlineLimit: 4096, // Inline images smaller than 4KB
  },
  // Optimize image assets
  assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.gif'],
})
