// src/components/MobileMenu.tsx

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: Props) {
  return (
    <>
      <div
        className={`drawer-overlay ${open ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`drawer-panel ${open ? "is-open" : ""}`}
        aria-hidden={!open}
        aria-label="Menu"
      >
        <div className="drawer-head">
          <div className="drawer-logo">K</div>
          <button className="drawer-close" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>

        <nav className="drawer-list">
          <a className="drawer-item" href="#">Perso</a>
          <a className="drawer-item" href="#">Recrutement</a>
          <a className="drawer-item" href="/admin.html">Admin</a>
          <a className="drawer-item" href="#">Connexion</a>

          <div className="drawer-search">
            <input
              id="search-input"
              placeholder="Rechercher…"
              onKeyDown={(e) => e.key === "Enter" && onClose()}
            />
          </div>

          <div className="drawer-stats">
            <span>Séries: 0 • Chapitres: 0</span>
          </div>
        </nav>
      </aside>
    </>
  );
}
