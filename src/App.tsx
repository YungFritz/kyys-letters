// src/App.tsx
import { useState } from "react";
import "./index.css";
import MobileMenu from "./components/MobileMenu";
import MobileTabBar from "./components/MobileTabBar";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-root">
      {/* ===== HEADER ===== */}
      <header className="site-header">
        <div className="header-inner">
          {/* Bouton menu mobile */}
          <button
            className="burger"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
          >
            <span />
            <span />
            <span />
          </button>

          {/* Logo */}
          <a className="logo-k" href="/" aria-label="Accueil">
            K
          </a>

          {/* Liens visibles sur desktop */}
          <nav className="top-links">
            <a href="#" className="chip">
              Perso
            </a>
            <a href="#" className="chip">
              Recrutement
            </a>
            <a href="/admin.html" className="chip chip-accent">
              Admin
            </a>
            <a href="#" className="chip">
              Connexion
            </a>
          </nav>

          {/* Barre de recherche */}
          <div className="header-search">
            <input
              id="search-input"
              placeholder="Rechercher une série, un tag, une langue..."
              aria-label="Rechercher"
            />
          </div>
        </div>
      </header>

      {/* ===== CONTENU PRINCIPAL ===== */}
      <main className="container with-tabbar">
        {/* Section de bienvenue */}
        <section className="hero">
          <div className="hero-card card">
            <h1 className="hero-title">Bienvenue</h1>
            <p className="hero-sub">
              Message d'accueil / accroche. Remplace par ton texte.
            </p>
          </div>

          <div className="hero-side">
            <div className="side-card card">
              <div className="side-title">Rejoindre</div>
              <p className="muted">Lien discord / contact / bouton</p>
              <a className="btn-accent" href="#" role="button">
                Ouvrir
              </a>
            </div>

            <div className="side-card card">
              <div className="side-title">Statistiques</div>
              <div className="muted">Séries: 0 • Chapitres: 0</div>
            </div>
          </div>
        </section>

        {/* Section populaire */}
        <section className="section" id="trending">
          <div className="section-header">
            <div className="section-title-row">
              <span>🔥</span>
              <h2 className="section-title">Populaire aujourd'hui</h2>
            </div>
            <a className="chip" href="#trending">
              Tendances
            </a>
          </div>

          <div className="card list-empty">
            Aucune série ajoutée pour le moment.
          </div>
        </section>

        {/* Derniers chapitres */}
        <section className="grid-2">
          <div className="card block">
            <div className="block-title">DERNIERS CHAPITRES POSTÉS</div>
            <div className="card list-empty">
              Aucun chapitre publié pour le moment.
            </div>
          </div>

          <aside className="card stats">
            <div className="block-title">Statistiques</div>
            <div className="stats-grid">
              <div className="row">
                <span className="muted">Visites totales (exemple)</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Séries</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Chapitres</span>
                <strong>0</strong>
              </div>
              <div className="row">
                <span className="muted">Langue</span>
                <strong>FR</strong>
              </div>
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="footer">
          © {new Date().getFullYear()} — Tous droits réservés
        </footer>
      </main>

      {/* ===== COMPOSANTS MOBILES ===== */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <MobileTabBar searchInputId="search-input" trendsSectionId="trending" />
    </div>
  );
}
