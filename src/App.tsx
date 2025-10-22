import { useEffect, useMemo, useState } from "react";
import "./index.css";
import Home from "./Home";
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

  const go = (hash: string) => {
    location.hash = hash;
  };

  const page = useMemo(() => {
    const r = route.replace(/^#/, "");
    if (r === "/" || r === "") return <Home />;
    if (r.startsWith("/admin")) {
      return (
        <div className="page-placeholder card-block">
          Page Admin (route prête)
        </div>
      );
    }
    if (r.startsWith("/trending")) {
      return (
        <div className="page-placeholder card-block">
          Tendances (route prête)
        </div>
      );
    }
    if (r.startsWith("/search")) {
      return (
        <div className="page-placeholder card-block">
          Recherche (route prête)
        </div>
      );
    }
    return <Home />;
  }, [route]);

  return (
    <>
      <TopBar />
      <main className="app-main">{page}</main>
      <MobileTabBar />
    </>
  );
}
