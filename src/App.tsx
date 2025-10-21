// src/App.tsx
import React from "react";
import "./index.css";
import Home from "./Home";

export default function App() {
  return (
    <div className="App min-h-screen flex flex-col bg-[#0d0d0d] text-white">
      {/* HEADER */}
      <header className="flex justify-between items-center px-6 py-3 bg-[#141414] border-b border-[#222]">
        <div className="flex items-center space-x-3">
          <span className="text-xl font-bold">Kyy’s Letters</span>
        </div>

        <nav className="flex space-x-2">
          <button
            onClick={() => (window.location.href = "/index.html")}
            className="px-3 py-1 rounded bg-[#222] hover:bg-[#2c2c2c]"
          >
            Accueil
          </button>
          <button
            onClick={() => (window.location.href = "/tendances.html")}
            className="px-3 py-1 rounded bg-[#222] hover:bg-[#2c2c2c]"
          >
            Tendances
          </button>
          <button
            onClick={() => (window.location.href = "/admin.html")}
            className="px-3 py-1 rounded bg-[#1f4f2e] hover:bg-[#25633c]"
          >
            Admin
          </button>
        </nav>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-6">
        <Home />
      </main>

      {/* FOOTER */}
      <footer className="text-center py-4 border-t border-[#222] text-gray-400 text-sm">
        © 2025 Kyy’s Letters — Tous droits réservés
      </footer>
    </div>
  );
}
