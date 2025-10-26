import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

declare global {
  interface Window {
    __LIBRARY?: unknown;
  }
}

function mount() {
  const rootEl = document.getElementById("root");
  if (!rootEl) throw new Error("Élément #root introuvable, vérifie index.html.");

  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Monte l'application immédiatement (chargement localStorage synchrone)
mount();
