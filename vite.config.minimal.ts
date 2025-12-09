import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Ultra-minimal build config for memory-constrained environments
export default defineConfig({
  plugins: [
    react({
      babel: {
        compact: true,
        minified: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      maxParallelFileOps: 1,
      cache: false,
      output: {
        manualChunks: (id) => {
          // Only split the absolute largest dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            return 'vendor';
          }
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
