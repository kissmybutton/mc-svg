import { loadPlugin } from "@donkeyclip/motorcortex";
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

// Add a house at 1s
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
  ["buildings"],
  1000,
);

// Add a tree at 2.5s
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
  ["nature"],
  2500,
);

// Add a sun at 4s
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
  ["nature"],
  4000,
);

// Glow the house at 5s
clip.addIncident(
  new McSvg.Attr(
    { animatedAttrs: { glow: 1 } },
    { selector: "!#house", duration: 300 },
  ),
  5000,
);
clip.addIncident(
  new McSvg.Attr(
    { animatedAttrs: { glow: 0 } },
    { selector: "!#house", duration: 500 },
  ),
  5500,
);

// Glow the tree at 6s
clip.addIncident(
  new McSvg.Attr(
    { animatedAttrs: { glow: 1 } },
    { selector: "!#tree", duration: 300 },
  ),
  6000,
);
clip.addIncident(
  new McSvg.Attr(
    { animatedAttrs: { glow: 0 } },
    { selector: "!#tree", duration: 500 },
  ),
  6500,
);

new Player({ clip, timeFormat: "ms" });
