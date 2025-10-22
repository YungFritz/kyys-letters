import React, { useState } from "react";

export default function TopBar() {
  const [q, setQ] = useState("");

  const go = (hash: string) => { location.hash = hash; };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // route de recherche (à adapter plus tard si tu veux une vraie page)
    if (q.trim()) go(`#/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <button className="logo" onClick={() => go("#/")}>K</button>

        <nav className="topnav">
          <button onClick={() => go("#/perso")}>Perso</button>
          <button onClick={() => go("#/recrutement")}>Recrutement</button>
          <button className="is-active" onClick={() => go("#/admin")}>Admin</button>
          <button onClick={() => go("#/login")}>Connexion</button>
        </nav>

        <form className="search" onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une série, un tag, une langue..."
            aria-label="Rechercher"
          />
        </form>
      </div>
    </header>
  );
}
