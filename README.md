# @donkeyclip/motorcortex-svg

A [MotorCortex](https://motorcortexjs.com/) plugin that provides a blank SVG canvas where elements can be dynamically added, removed, and animated.

## Features

- Blank SVG canvas with configurable viewBox and background
- Add SVG elements at specific timeline positions via `addCustomEntity`
- Remove elements via `removeCustomEntity`
- Each entity is a `<g>` wrapper with its own transform — positioned via `translate` and `scale`
- **CSSEffect from MC core works out of the box** — target entities with `!#entityId` selectors to animate opacity, transform, color, and any CSS property
- Full forward/backward seek support via MC's VisibilityChannel
- Zero dependencies — pure SVG

## Installation

```bash
npm install @donkeyclip/motorcortex-svg
```

## Getting Started

```js
import { CSSEffect, loadPlugin } from "@donkeyclip/motorcortex";
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
  [],
  1000,
);

// Animate it with CSSEffect (from MC core — no plugin-specific Effect needed)
clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { opacity: 0.3 } },
    { selector: "!#myCircle", duration: 1000 },
  ),
  2000,
);

clip.addIncident(
  new CSSEffect(
    { animatedAttrs: { transform: { scale: 1.5 } } },
    { selector: "!#myCircle", duration: 1000 },
  ),
  3000,
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

### addCustomEntity

Add SVG elements at a specific timeline position:

```js
clip.addCustomEntity(
  {
    svg: '<rect width="50" height="50" fill="blue"/>',
    x: 100, // X translate (SVG coords)
    y: 200, // Y translate (SVG coords)
    scale: 1.5, // Uniform scale (optional, default 1)
  },
  "entityId", // Unique ID
  [], // MC classes for group targeting
  2000, // Birthtime (ms)
);
```

The SVG markup is wrapped in a `<g transform="translate(x,y) scale(s)">` and appended to the root SVG. The `<g>` element becomes the entity's DOM node.

### Animating with CSSEffect

MC's built-in `CSSEffect` works directly on custom entities — no plugin-specific Effect class needed. Target entities with `!#entityId` selectors:

```js
import { CSSEffect } from "@donkeyclip/motorcortex";

// Opacity
new CSSEffect(
  { animatedAttrs: { opacity: 0.5 } },
  { selector: "!#entityId", duration: 1000 },
);

// Transform (scale, rotate, translate)
new CSSEffect(
  { animatedAttrs: { transform: { scale: 2, rotate: "180deg" } } },
  { selector: "!#entityId", duration: 1000 },
);
```

This works because the plugin sets `html_element` on each entity, which CSSEffect resolves automatically to the DOM node.

### Convention: `html_element`

Entities returned by `renderCustomEntity` include an `html_element` property pointing to the SVG `<g>` DOM node. This is the standard convention that enables CSSEffect (and any future MC incident) to work on custom entities across all plugins.

## Development

```bash
npm install
npm start        # Dev server with hot reload
npm run build    # Production build
```

## License

MIT
