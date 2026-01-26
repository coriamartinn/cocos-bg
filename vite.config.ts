import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    // Solo necesitamos el alias para la carpeta src (usado por shadcn/ui)
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'dist', // Correcto para Vercel
    rollupOptions: {
      output: {
        // Esto soluciona la advertencia de "Large chunks" separando node_modules
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});