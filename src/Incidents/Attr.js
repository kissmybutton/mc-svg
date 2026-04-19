import { Effect } from "@donkeyclip/motorcortex";

/**
 * Attr tweens visual properties of SVG element entities.
 *
 * Supported animatedAttrs:
 *   - opacity  {number}  0..1
 *   - fill     {string}  hex color
 *   - stroke   {string}  hex color
 *   - glow     {number}  0..1  — CSS drop-shadow highlight
 */
export default class Attr extends Effect {
  getScratchValue() {
    const entity = this.element?.entity;
    if (!entity) return 0;

    const key = this.attributeKey;
    if (key === "opacity") {
      const v = parseFloat(entity._originalOpacity ?? "1");
      return isNaN(v) ? 1 : v;
    }
    if (key === "glow") {
      return entity._glow ?? 0;
    }
    if (key === "fill") {
      return entity._originalFill || "#000000";
    }
    if (key === "stroke") {
      return entity.element?.getAttribute("stroke") || "#000000";
    }
    return 0;
  }

  onGetContext() {
    this._entity = this.element?.entity;
  }

  onProgress(fraction) {
    const entity = this._entity;
    if (!entity) return;

    const key = this.attributeKey;
    const from = this.initialValue;
    const to = this.targetValue;
    const el = entity.element;
    if (!el) return;

    if (key === "opacity") {
      const value = from + (to - from) * fraction;
      el.style.opacity = String(value);
    } else if (key === "glow") {
      const value = from + (to - from) * fraction;
      entity._glow = value;
      el.style.filter =
        value > 0.01
          ? `drop-shadow(0px 0px ${6 + value * 12}px rgba(255, 220, 50, 1)) drop-shadow(0px 0px ${2 + value * 6}px rgba(255, 255, 255, ${Math.min(value * 1.5, 1)}))`
          : "";
    } else if (key === "fill") {
      const color = _lerpColor(
        typeof from === "string" ? from : "#000000",
        typeof to === "string" ? to : "#000000",
        fraction,
      );
      el.setAttribute("fill", color);
    } else if (key === "stroke") {
      const color = _lerpColor(
        typeof from === "string" ? from : "#000000",
        typeof to === "string" ? to : "#000000",
        fraction,
      );
      el.setAttribute("stroke", color);
    }
  }
}

// ─── Color helpers ────────────────────────────────────────────────────────────

function _parseHex(hex) {
  if (!hex || typeof hex !== "string" || !hex.match(/^#?[0-9a-fA-F]{3,6}$/)) {
    return [0, 0, 0];
  }
  const h = hex.replace("#", "");
  return h.length === 3
    ? [
        parseInt(h[0] + h[0], 16),
        parseInt(h[1] + h[1], 16),
        parseInt(h[2] + h[2], 16),
      ]
    : [
        parseInt(h.slice(0, 2), 16),
        parseInt(h.slice(2, 4), 16),
        parseInt(h.slice(4, 6), 16),
      ];
}

function _lerpColor(from, to, t) {
  const [r1, g1, b1] = _parseHex(from);
  const [r2, g2, b2] = _parseHex(to);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
