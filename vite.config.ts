// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pas d'import "path", pas de __dirname.
// Vite prend "index.html" comme entrée par défaut.
// Le dossier "public/" est servi tel quel (admin.html, add-manga.html, etc.).

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Aucun rollupOptions.input nécessaire ici.
  },
})
