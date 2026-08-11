import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⚠️  NO agregar "build.outDir" aquí.
// Vite debe generar el output en ./dist (dentro de client/)
// para que Vercel lo encuentre cuando Root Directory = "client".
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
