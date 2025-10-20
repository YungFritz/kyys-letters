/* Reset simple + plein large */
:root { color-scheme: dark; }
* { box-sizing: border-box; }

html, body, #root { height: 100%; }

body {
  margin: 0;
  background: #0a0a0a; /* noir doux */
  color: #e5e7eb;      /* gris clair */
}

/* Le template Vite met un max-width/padding ici => on l’enlève */
#root {
  max-width: none;
  margin: 0;
  padding: 0;
}
