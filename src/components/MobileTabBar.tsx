// src/components/MobileTabBar.tsx
type Props = {
  searchInputId?: string;
  trendsSectionId?: string;
};

export default function MobileTabBar({ searchInputId, trendsSectionId }: Props) {
  const goHome = () => (window.location.href = "/");
  const goAdmin = () => (window.location.href = "/admin.html");
  const goSearch = () => {
    if (!searchInputId) return;
    const el = document.getElementById(searchInputId) as HTMLInputElement | null;
    if (el) {
      el.focus();
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const goTrends = () => {
    if (!trendsSectionId) return;
    const el = document.getElementById(trendsSectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="mobile-tabbar" aria-label="Navigation mobile">
      <button className="tabitem" onClick={goHome} aria-label="Accueil">
        <div className="ico">🏠</div>
        <div className="lbl">Accueil</div>
      </button>

      <button className="tabitem" onClick={goSearch} aria-label="Rechercher">
        <div className="ico">🔎</div>
        <div className="lbl">Recherche</div>
      </button>

      <button className="tabitem" onClick={goTrends} aria-label="Tendances">
        <div className="ico">🔥</div>
        <div className="lbl">Tendances</div>
      </button>

      <button className="tabitem" onClick={goAdmin} aria-label="Admin">
        <div className="ico">⚙️</div>
        <div className="lbl">Admin</div>
      </button>
    </nav>
  );
}
