import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves under https://<user>.github.io/<repo>/, so assets
  // must be loaded from /rest-in-pieces/. In dev (`npm run dev`) base is '/',
  // so this only affects production builds.
  base: '/rest-in-pieces/',
});
