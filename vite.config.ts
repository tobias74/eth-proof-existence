import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      // Polyfill `global` and other necessary Node.js globals
      define: {
        global: 'globalThis',
      },
      plugins: [
      ],
    },
  },
  resolve: {
    alias: {
    },
  },
  build: {
    rollupOptions: {
      plugins: [
      ],
    },
  },
});
