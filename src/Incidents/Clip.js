import { BrowserClip } from "@donkeyclip/motorcortex";

/**
 * SvgClip provides a blank SVG canvas where elements can be added/removed
 * dynamically via addCustomEntity.
 *
 * CSSEffect from MC core works on custom entities out of the box — entities
 * expose `html_element` pointing to the DOM node, which CSSEffect resolves
 * automatically.
 *
 * Attrs:
 *   viewBox    {string}  SVG viewBox (default "0 0 1000 1000")
 *   background {string}  Background color (default "transparent")
 *
 * addCustomEntity definition:
 *   svg        {string}  SVG markup to inject
 *   x          {number}  X translate. Default 0.
 *   y          {number}  Y translate. Default 0.
 *   scale      {number}  Uniform scale. Default 1.
 */
export default class SvgClip extends BrowserClip {
  get html() {
    const viewBox = this.attrs.viewBox || "0 0 1000 1000";
    const bg = this.attrs.background || "transparent";
    return `<div style="width:100%;height:100%;overflow:hidden;">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"
           preserveAspectRatio="xMidYMid meet"
           style="width:100%;height:100%;background:${bg};"></svg>
    </div>`;
  }

  onAfterRender() {
    const container = this.context.rootElement;
    const { offsetWidth, offsetHeight } = container;

    container.style.width = `${offsetWidth}px`;
    container.style.height = `${offsetHeight}px`;

    this._svg = container.querySelector("svg");

    // ── MC context patches ────────────────────────────────────────────────

    const _origSetMCID = this.ownContext.setMCID;
    this.ownContext.setMCID = (el, mcid) => {
      // Unwrap custom entity to DOM node if available
      const target = el?.html_element ?? el;
      if (target && typeof target.nodeType === "number") {
        _origSetMCID(target, mcid);
      }
    };

    const _origGetElements = this.ownContext.getElements;
    this.ownContext.getElements = (selector) => {
      const result = _origGetElements(selector);
      return Array.isArray(result) ? result.filter((el) => el != null) : result;
    };

    this.contextLoaded();
  }

  renderCustomEntity(definition) {
    if (!definition || typeof definition !== "object") return null;
    if (definition._isSvgEntity) return definition;

    if (definition.svg) {
      // Outer <g> for SVG positioning (transform attribute)
      const outer = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const x = definition.x || 0;
      const y = definition.y || 0;
      const scale = definition.scale || 1;
      if (x !== 0 || y !== 0 || scale !== 1) {
        outer.setAttribute(
          "transform",
          `translate(${x}, ${y})${scale !== 1 ? ` scale(${scale})` : ""}`,
        );
      }

      // Inner <g> for CSS animations (transform style) — avoids conflict
      // with SVG transform attribute on the outer <g>
      const inner = document.createElementNS("http://www.w3.org/2000/svg", "g");

      const temp = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      temp.innerHTML = definition.svg;
      while (temp.firstChild) {
        inner.appendChild(temp.firstChild);
      }

      // Apply initial CSS styles to the inner <g> (e.g. scaleY(0) for grow-in)
      if (definition.initialStyle) {
        Object.assign(inner.style, definition.initialStyle);
      }

      // Set a unique data-motorcortex2-id so CSSEffect can track this element.
      // MC normally sets this for parsed DOM elements but not for custom entities.
      const mcid = `svg_ent_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      inner.setAttribute("data-motorcortex2-id", mcid);

      outer.appendChild(inner);
      this._svg.appendChild(outer);

      // html_element points to the INNER <g> — CSSEffect animates this one
      return {
        _isSvgEntity: true,
        html_element: inner,
        _outerG: outer,
      };
    }

    return null;
  }

  hideEntity(element) {
    if (!element || !element._isSvgEntity) return;
    const el = element._outerG || element.html_element;
    if (el) {
      el.style.opacity = "0";
    }
  }
}
