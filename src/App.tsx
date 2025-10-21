import { useEffect, useState } from "react";
import Home from "./Home";
import "./index.css";

/** Mini router local sans dépendance */
type Route = "home" | "admin" | "add" | "edit";
function parseRoute(): Route {
  const h = (window.location.hash || "").replace(/^#/, "");
  if (h === "/admin") return "admin";
  if (h === "/add-manga") return "add";
  if (h === "/edit-manga") return "edit";
  return "home";
}

function IframePage({ src }: { src: string }) {
  return (
    <div style={{ height: "100vh" }}>
      <iframe
        src={src}
        title={src}
        style={{ border: "none", width: "100%", height: "100%", background: "#0a0a0a" }}
      />
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute());

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener("hashchange", onHash);
    onHash();
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route === "admin") return <IframePage src="/admin.html" />;
  if (route === "add") return <IframePage src="/add-manga.html" />;
  if (route === "edit") return <IframePage src="/edit-manga.html" />;
  return <Home />;
}
