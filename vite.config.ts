import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public', // <-- on garde /public pour nos pages statiques
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      // On NE déclare que index.html comme entrée à builder
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
