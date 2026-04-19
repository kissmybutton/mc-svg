import { CSSEffect, loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import SvgPluginDef from "../dist/bundle.esm.js";

const McSvg = loadPlugin(SvgPluginDef);

const clip = new McSvg.Clip(
  { viewBox: "0 0 500 400", background: "#f8f9fa" },
  {
    host: document.getElementById("clip"),
    containerParams: { width: "800px", height: "600px" },
    duration: 8000,
  },
);

// ── Add entities ────────────────────────────────────────────────────────────

// House at 500ms
clip.addCustomEntity(
  {
    svg: `
      <rect x="0" y="40" width="120" height="80" fill="#e74c3c" stroke="#c0392b" stroke-width="2"/>
      <polygon points="60,-10 -10,40 130,40" fill="#8b4513" stroke="#6b3410" stroke-width="2"/>
      <rect x="45" y="75" width="30" height="45" fill="#8b4513"/>
      <rect x="15" y="55" width="25" height="25" fill="#85c1e9" stroke="#2980b9" stroke-width="1.5"/>
      <rect x="80" y="55" width="25" height="25" fill="#85c1e9" stroke="#2980b9" stroke-width="1.5"/>
    `,
    x: 50,
    y: 150,
  },
  "house",
  [],
  500,
);

// Tree at 2s
clip.addCustomEntity(
  {
    svg: `
      <rect x="15" y="50" width="10" height="40" fill="#8b4513"/>
      <circle cx="20" cy="30" r="30" fill="#27ae60"/>
      <circle cx="5" cy="40" r="20" fill="#2ecc71"/>
      <circle cx="35" cy="40" r="20" fill="#2ecc71"/>
    `,
    x: 250,
    y: 180,
  },
  "tree",
  [],
  2000,
);

// Sun at 3.5s
clip.addCustomEntity(
  {
    svg: `
      <circle cx="0" cy="0" r="30" fill="#f1c40f"/>
      <line x1="-45" y1="0" x2="-35" y2="0" stroke="#f39c12" stroke-width="3"/>
      <line x1="35" y1="0" x2="45" y2="0" stroke="#f39c12" stroke-width="3"/>
      <line x1="0" y1="-45" x2="0" y2="-35" stroke="#f39c12" stroke-width="3"/>
      <line x1="0" y1="35" x2="0" y2="45" stroke="#f39c12" stroke-width="3"/>
    `,
    x: 400,
    y: 70,
  },
  "sun",
  [],
  3500,
);

// ── CSSEffect from MC core — targeting custom entities via !# selector ──────

// Fade the house to 30% opacity at 4.5s
clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0.3 } },
    { selector: "!#house", duration: 1000 },
  ),
  4500,
);

// Fade it back at 5.5s
clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 1 } },
    { selector: "!#house", duration: 500 },
  ),
  5500,
);

// Scale the tree up at 5s
clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { transform: { scale: 1.5 } } },
    { selector: "!#tree", duration: 1000 },
  ),
  5000,
);

// Rotate the sun at 6s
clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { transform: { rotate: "360deg" } } },
    { selector: "!#sun", duration: 2000 },
  ),
  6000,
);

new Player({ clip, timeFormat: "ms" });
