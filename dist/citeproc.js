"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const csl = __importStar(require("citeproc"));
const utils_1 = require("./utils");
exports.ALLOWED_OUTPUT_FORMATS = {
    "html": "html",
    "text": "text",
    "asciidoc": "asciidoc",
    "fo": "fo",
    "rtf": "rtf",
};
exports.defaultRenderOptions = {
    outputFormat: "html",
    lang: "en",
    style: "apa",
};
function renderCitation(citation, options = exports.defaultRenderOptions) {
    const { outputFormat, lang, style } = Object.assign(Object.assign({}, exports.defaultRenderOptions), options);
    const sys = {
        retrieveLocale: (RFC_5646_language_tag) => {
            return utils_1.readXML('locales-en-US.xml');
        },
        retrieveItem: (id) => {
            return Object.assign({ id }, citation);
        },
    };
    const styleXML = utils_1.readXML(`${style}.csl`);
    const citeproc = new csl.Engine(sys, styleXML, lang);
    citeproc.setOutputFormat(outputFormat);
    citeproc.updateItems(["citation1"]);
    const [, result] = citeproc.makeBibliography();
    return result[0].trim();
}
exports.renderCitation = renderCitation;
