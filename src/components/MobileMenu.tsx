// src/components/MobileMenu.tsx
type Props = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({ open, onClose }: Props) {
  if (!open) return null;

  const go = (href: string) => () => {
    window.location.href = href;
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />

      <aside className="sheet-card" role="dialog" aria-modal="true">
        <div className="sheet-head">
          <div className="sheet-logo">K</div>
          <button className="sheet-close" onClick={onClose} aria-label="Fermer">
            ✕
          </button>
        </div>

        <div className="sheet-body">
          <button className="sheet-item" onClick={go("#")}>Perso</button>
          <button className="sheet-item" onClick={go("#")}>Recrutement</button>
          <button className="sheet-item sheet-item-accent" onClick={go("/admin.html")}>
            Admin
          </button>
          <button className="sheet-item" onClick={go("#")}>Connexion</button>

          <div className="sheet-search">
            <input placeholder="Rechercher..." />
          </div>

          <div className="sheet-stats muted">Séries: 0 • Chapitres: 0</div>
        </div>
      </aside>
    </>
  );
}
