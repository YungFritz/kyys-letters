// src/components/MobileTabBar.tsx

type MobileTabBarProps = {
  onNav?: (to: string) => void;
  current?: string;
};

export default function MobileTabBar({ onNav, current }: MobileTabBarProps) {
  const go = (to: string) => {
    if (onNav) onNav(to);
    else location.hash = `#/${to}`;
  };

  return (
    <nav className="mobilebar" aria-label="Navigation mobile">
      <button
        onClick={() => go("")}
        aria-current={current === "home" ? "page" : undefined}
        title="Accueil"
      >
        <span className="ico">🏠</span>
        <span>Accueil</span>
      </button>

      <button
        onClick={() => go("search")}
        aria-current={current === "search" ? "page" : undefined}
        title="Rechercher"
      >
        <span className="ico">🔍</span>
        <span>Recherche</span>
      </button>

      <button
        onClick={() => go("trending")}
        aria-current={current === "trends" ? "page" : undefined}
        title="Tendances"
      >
        <span className="ico">🔥</span>
        <span>Tendances</span>
      </button>

      <button
        onClick={() => go("admin")}
        aria-current={current === "admin" ? "page" : undefined}
        title="Admin"
      >
        <span className="ico">⚙️</span>
        <span>Admin</span>
      </button>
    </nav>
  );
}
