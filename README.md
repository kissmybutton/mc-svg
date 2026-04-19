# @donkeyclip/motorcortex-svg

A [MotorCortex](https://motorcortexjs.com/) plugin that provides a blank SVG canvas where elements can be dynamically added, removed, and animated via `addCustomEntity` / `removeCustomEntity`.

## Features

- Blank SVG canvas with configurable viewBox and background
- Add SVG elements at specific timeline positions via `addCustomEntity`
- Remove elements via `removeCustomEntity`
- Each added element is a `<g>` wrapper positioned via `transform` — animatable with MC Effects
- Attr Effect: animate opacity, fill, stroke, and glow on individual elements
- Full forward/backward seek support via MC's VisibilityChannel

## Installation

```bash
npm install @donkeyclip/motorcortex-svg
```

## Getting Started

```js
import { loadPlugin } from "@donkeyclip/motorcortex";
import Player from "@donkeyclip/motorcortex-player";
import SvgPluginDef from "@donkeyclip/motorcortex-svg";

const McSvg = loadPlugin(SvgPluginDef);

const clip = new McSvg.Clip(
  { viewBox: "0 0 500 400", background: "#f8f9fa" },
  {
    host: document.getElementById("clip"),
    containerParams: { width: "800px", height: "600px" },
    duration: 5000,
  },
);

// Add a red circle at 1s
clip.addCustomEntity(
  {
    svg: '<circle cx="0" cy="0" r="40" fill="#e74c3c"/>',
    x: 100,
    y: 100,
  },
  "myCircle",
  ["shapes"],
  1000,
);

// Glow it at 2s
clip.addIncident(
  new McSvg.Attr(
    { animatedAttrs: { glow: 1 } },
    { selector: "!#myCircle", duration: 500 },
  ),
  2000,
);

new Player({ clip });
```

## API

### SvgClip (Clip)

Extends `BrowserClip`. Creates a root `<svg>` canvas.

| Attr         | Type     | Default           | Description             |
| ------------ | -------- | ----------------- | ----------------------- |
| `viewBox`    | `string` | `"0 0 1000 1000"` | SVG viewBox             |
| `background` | `string` | `"transparent"`   | Canvas background color |

#### addCustomEntity

Add SVG elements at a specific timeline position:

```js
clip.addCustomEntity(
  {
    svg: '<rect width="50" height="50" fill="blue"/>', // SVG markup
    x: 100, // X translate (SVG coords)
    y: 200, // Y translate (SVG coords)
    scale: 1.5, // Uniform scale (optional)
  },
  "entityId", // Unique ID
  ["classes"], // MC classes for group targeting
  2000, // Birthtime (ms)
);
```

The SVG markup is wrapped in a `<g transform="translate(x,y) scale(s)">` and appended to the root SVG.

### Attr (Effect)

Tweens visual properties of SVG entities. Target with `!#entityId`.

| Animated Attr | Type     | Range | Description               |
| ------------- | -------- | ----- | ------------------------- |
| `opacity`     | `number` | 0..1  | Element opacity           |
| `fill`        | `string` | hex   | Fill color                |
| `stroke`      | `string` | hex   | Stroke color              |
| `glow`        | `number` | 0..1  | CSS drop-shadow highlight |

## Development

```bash
npm install
npm start        # Dev server with hot reload
npm run build    # Production build
```

## License

MIT
