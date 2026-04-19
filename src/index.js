import SvgClip from "./Incidents/Clip";
import { name, version } from "../package.json";

const svgClipRules = {
  viewBox: {
    type: "string",
    optional: true,
  },
  background: {
    type: "string",
    optional: true,
  },
};

export default {
  npm_name: name,
  version: version,
  incidents: [],
  Clip: {
    exportable: SvgClip,
    attributesValidationRules: svgClipRules,
  },
};
