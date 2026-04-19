import SvgClip from "./Incidents/Clip";
import Attr from "./Incidents/Attr";
import { name, version } from "../package.json";

const attrRules = {
  animatedAttrs: {
    type: "object",
    strict: false,
  },
};

const svgClipRules = {
  svg: {
    type: "string",
    optional: true,
  },
  entities: {
    type: "array",
    optional: true,
  },
};

export default {
  npm_name: name,
  version: version,
  incidents: [
    {
      exportable: Attr,
      name: "Attr",
      attributesValidationRules: attrRules,
    },
  ],
  Clip: {
    exportable: SvgClip,
    attributesValidationRules: svgClipRules,
  },
};
