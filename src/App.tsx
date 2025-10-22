import React, { useEffect, useMemo, useState } from "react";
import "./index.css";
import Home from "./Home";

// Si tu as d’autres pages déjà codées, importe-les ici
// import Admin from "./pages/admin"; etc.

import TopBar from "./components/TopBar";
import MobileTabBar from "./components/MobileTabBar";

type Route = "#/" | "" | "#/admin" | "#/trending" | "#/search" | string;

function useHashRoute(): Route {
  const [h, setH] = useState<Route>((location.hash || "#/") as Route);
  useEffect(() => {
    const fn = () => setH((location.hash || "#/") as Route);
    window.addEventListener("hashchange", fn);
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return h;
}

export default function App() {
  const route = useHashRoute();

  const page = useMemo(() => {
    const r = route.replace(/^#/, "");
    // routing minimal, on garde Home par défaut
    if (r === "/" || r === "") return <Home />;

    if (r.startsWith("/admin")) {
      // si tu as une page admin React, place-la ici
      return <div className="page-placeholder card-block">Page Admin (route prête)</div>;
    }

    if (r.startsWith("/trending")) {
      return <div className="page-placeholder card-block">Tendances (route prête)</div>;
    }

    if (r.startsWith("/search")) {
      return <div className="page-placeholder card-block">Recherche (route prête)</div>;
    }

    // fallback
    return <Home />;
  }, [route]);

  return (
    <>
      {/* Barre du haut (desktop & tablette) */}
      <TopBar />

      {/* Contenu des pages — ta Home.tsx reste intacte */}
      <main className="app-main">
        {page}
      </main>

      {/* Barre mobile (seulement sur petits écrans via CSS) */}
      <MobileTabBar />
    </>
  );
}
