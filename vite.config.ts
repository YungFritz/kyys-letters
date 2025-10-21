import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        admin: "admin.html",
        addManga: "add-manga.html",
        addChapitre: "add-chapitre.html",
        editeManga: "edit-manga.html", // ou edite-manga.html selon ton nom
      },
    },
  },
});
