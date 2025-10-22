import React from "react";
import "./index.css";

// ———————————————————————————————————————
// UI réutilisable
const SectionCard: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ className, children }) => (
  <div className={`card-block ${className || ""}`}>{children}</div>
);

const TitleBar: React.FC<{
  icon?: React.ReactNode;
  title: string;
  right?: React.ReactNode;
}> = ({ icon, title, right }) => (
  <div className="titlebar">
    <div className="titlebar-left">
      {icon ? <span className="titlebar-ico">{icon}</span> : null}
      <h3 className="titlebar-title">{title}</h3>
    </div>
    {right ? <div className="titlebar-right">{right}</div> : null}
  </div>
);

// ———————————————————————————————————————
// Page d’accueil
export default function Home() {
  return (
    <div className="home-wrap">
      {/* Bandeau accueil + encart latéral (Rejoindre / Stats) */}
      <div className="grid grid-2">
        <SectionCard>
          <h1 className="welcome-title">Bienvenue</h1>
          <p className="welcome-sub">
            Message d'accueil / accroche. Remplace par ton texte.
          </p>
        </SectionCard>

        <div className="side-stack">
          <SectionCard>
            <h4 className="side-title">Rejoindre</h4>
            <p className="muted">Lien discord / contact / bouton</p>
            <a className="btn-primary" href="#" aria-label="Ouvrir le lien d’invitation">
              Ouvrir
            </a>
          </SectionCard>

          <SectionCard>
            <h4 className="side-title">Statistiques</h4>
            <div className="muted">Séries: 0 • Chapitres: 0</div>
          </SectionCard>
        </div>
      </div>

      {/* Populaire aujourd’hui */}
      <SectionCard className="mt24">
        <TitleBar
          icon={<span>🔥</span>}
          title="Populaire aujourd'hui"
          right={<button className="pill" onClick={() => location.hash = "#/trending"}>Tendances</button>}
        />
        <div className="placeholder-line">Aucune série ajoutée pour le moment.</div>
      </SectionCard>

      {/* Derniers chapitres + Stats (de droite) */}
      <div className="grid grid-2 mt24">
        <SectionCard>
          <h4 className="zone-title">DERNIERS CHAPITRES POSTÉS</h4>
          <div className="placeholder-box">Aucun chapitre publié pour le moment.</div>
        </SectionCard>

        <SectionCard>
          <h4 className="side-title">Statistiques</h4>
          <ul className="stats-list">
            <li><span className="muted">Visites totales (exemple)</span><strong>0</strong></li>
            <li><span className="muted">Séries</span><strong>0</strong></li>
            <li><span className="muted">Chapitres</span><strong>0</strong></li>
            <li><span className="muted">Langue</span><strong>FR</strong></li>
          </ul>
        </SectionCard>
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} — Tous droits réservés
      </footer>
    </div>
  );
}
