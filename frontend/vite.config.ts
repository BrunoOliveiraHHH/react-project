import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Configuração do Vite.
 *
 * 🔁 PARALELO COM VUE/QUASAR:
 *  - Quasar tem `quasar.config.js`. Aqui o Vite tem `vite.config.ts`.
 *  - O plugin `@vitejs/plugin-react` ativa Fast Refresh (HMR) — equivalente
 *    ao HMR do Quasar/Vite-Vue.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
  },
});
