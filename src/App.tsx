import React from "react";
import "./index.css";
import Home from "./Home";

/**
 * Composant racine de l’application.
 * On importe Home afin d’utiliser la logique de chargement des séries
 * depuis le localStorage et l’affichage complet déjà implémentés dans Home.tsx.
 */
export default function App() {
  return <Home />;
}
