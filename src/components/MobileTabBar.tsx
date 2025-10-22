import React from "react";

export default function MobileTabBar() {
  const go = (hash: string) => { location.hash = hash; };

  return (
    <nav className="mobilebar" aria-label="Navigation mobile">
      <button onClick={() => go("#/")}>
        <span className="ico">🏠</span>
        <span>Accueil</span>
      </button>
      <button onClick={() => go("#/search")}>
        <span className="ico">🔎</span>
        <span>Rechercher</span>
      </button>
      <button onClick={() => go("#/trending")}>
        <span className="ico">🔥</span>
        <span>Tendances</span>
      </button>
      <button onClick={() => go("#/admin")}>
        <span className="ico">⚙️</span>
        <span>Admin</span>
      </button>
    </nav>
  );
}
