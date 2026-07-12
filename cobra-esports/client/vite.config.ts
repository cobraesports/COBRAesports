import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Только для локальной разработки (npm run dev): Vite dev-сервер проксирует
// /api/* на локальный backend, чтобы не задавать VITE_API_URL при разработке.
// На проде (npm run build) прокси не участвует — используется VITE_API_URL
// из client/src/config/api.ts, которое подставляется на этапе сборки.
const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        credentials: true,
      },
    },
  },
});
