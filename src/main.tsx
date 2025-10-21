import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // En prod Vercel, pour éviter le double render dev, tu peux enlever StrictMode si tu veux
  //<React.StrictMode>
    <App />
  //</React.StrictMode>
);
