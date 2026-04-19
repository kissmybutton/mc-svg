import { BrowserClip } from "@donkeyclip/motorcortex";

/**
 * SvgClip provides a blank SVG canvas where elements can be added/removed
 * dynamically via addCustomEntity / removeCustomEntity.
 *
 * Attrs:
 *   viewBox    {string}  SVG viewBox (default "0 0 1000 1000")
 *   background {string}  Background color (default "transparent")
 *
 * addCustomEntity definition:
 *   svg        {string}  SVG markup to inject (e.g. '<circle cx="50" cy="50" r="40" fill="red"/>')
 *   x          {number}  X position (translate). Default 0.
 *   y          {number}  Y position (translate). Default 0.
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

    this._entityMap = {};
    this._svg = container.querySelector("svg");

    // ── MC context patches ────────────────────────────────────────────────

    const _origSetMCID = this.ownContext.setMCID;
    this.ownContext.setMCID = (el, mcid) => {
      if (el && typeof el.nodeType === "number") {
        _origSetMCID(el, mcid);
      }
    };

    const _origGetElements = this.ownContext.getElements;
    this.ownContext.getElements = (selector) => {
      const result = _origGetElements(selector);
      return Array.isArray(result) ? result.filter((el) => el != null) : result;
    };

    this.ownContext.showElement = (el) => this.showElement(el);
    this.ownContext.hideElement = (el) => this.hideElement(el);

    this.contextLoaded();
  }

  // ── addCustomEntity / removeCustomEntity ──────────────────────────────

  /**
   * Called by MC when addCustomEntity is invoked.
   * Creates an SVG <g> wrapper, injects the provided SVG markup into it,
   * positions it via transform, and appends to the root <svg>.
   */
  renderCustomEntity(definition) {
    if (!definition || typeof definition !== "object") return null;
    if (definition._isSvgEntity) return definition;

    if (definition.svg) {
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

      // Position via transform
      const x = definition.x || 0;
      const y = definition.y || 0;
      const scale = definition.scale || 1;
      if (x !== 0 || y !== 0 || scale !== 1) {
        g.setAttribute(
          "transform",
          `translate(${x}, ${y})${scale !== 1 ? ` scale(${scale})` : ""}`,
        );
      }

      // Inject SVG content
      const temp = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      temp.innerHTML = definition.svg;
      while (temp.firstChild) {
        g.appendChild(temp.firstChild);
      }

      this._svg.appendChild(g);

      const entity = {
        _isSvgEntity: true,
        element: g,
        _originalOpacity: "1",
        _originalFill: "",
        _glow: 0,
      };
      return entity;
    }

    return null;
  }

  showElement(element) {
    if (!element || !element._isSvgEntity) return;
    const el = element.element;
    if (el) {
      el.style.display = "";
      el.style.opacity = element._originalOpacity ?? "1";
    }
  }

  hideElement(element) {
    if (!element || !element._isSvgEntity) return;
    const el = element.element;
    if (el) {
      el.style.display = "none";
      el.style.opacity = "0";
    }
  }
}
