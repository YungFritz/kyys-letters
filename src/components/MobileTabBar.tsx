// src/components/MobileTabBar.tsx
import { useCallback } from "react";

type Props = {
  /** id du champ recherche pour le focus */
  searchInputId?: string;
  /** id du bloc tendances pour y scroller */
  trendsSectionId?: string;
};

export default function MobileTabBar({
  searchInputId = "search-input",
  trendsSectionId = "trending",
}: Props) {
  const goHome = useCallback(() => {
    // Va à l’accueil sans casser l’état
    if (location.pathname !== "/") location.href = "/";
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const openSearch = useCallback(() => {
    const el = document.getElementById(searchInputId) as
      | HTMLInputElement
      | null;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => el.focus(), 250);
    }
  }, [searchInputId]);

  const goTrends = useCallback(() => {
    const el = document.getElementById(trendsSectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [trendsSectionId]);

  const goAdmin = useCallback(() => {
    // Ta page admin HTML
    location.href = "/admin.html";
  }, []);

  return (
    <nav className="mobile-tabbar" role="navigation" aria-label="Navigation mobile">
      <button className="mobile-tabitem" onClick={goHome}>
        <span className="tab-ico" aria-hidden>🏠</span>
        <span className="tab-txt">Accueil</span>
      </button>

      <button className="mobile-tabitem" onClick={openSearch}>
        <span className="tab-ico" aria-hidden>🔎</span>
        <span className="tab-txt">Recherche</span>
      </button>

      <button className="mobile-tabitem" onClick={goTrends}>
        <span className="tab-ico" aria-hidden>🔥</span>
        <span className="tab-txt">Tendances</span>
      </button>

      <button className="mobile-tabitem" onClick={goAdmin}>
        <span className="tab-ico" aria-hidden>⚙️</span>
        <span className="tab-txt">Admin</span>
      </button>
    </nav>
  );
}
