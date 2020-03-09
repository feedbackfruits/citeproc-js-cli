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
exports.token_article_dict = {
    'type': 'article-journal',
    'title': 'The varieties of capitalism and hybrid success',
    'container-title': 'Comparative Political Studies',
    'page': '307-332',
    'volume': '40',
    'issue': '3',
    'source': 'Highwire 2.0',
    'abstract': 'The varieties of capitalism literature maintains that advanced capitalist countries whose institutions best fit either the liberal or coordinated market economy types will perform better than countries whose institutions are mixed. This is because hybrids are less likely to yield functionally beneficial institutional complementarities. The authors challenge this assertion. Denmark has performed as well as many purer cases during the 1990s. And Denmark has recently developed a more hybrid form th...',
    'URL': 'https://journals.sagepub.com/doi/abs/10.1177/0010414006286542',
    'DOI': '10.1177/0010414006286542',
    'ISSN': '1552-3829',
    'author': [
        { 'family': 'Campbell', 'given': 'John L.' },
        { 'family': 'Pedersen', 'given': 'Ove K.' },
    ],
    'issued': {
        'date-parts': [['2007', '3', '1']]
    },
    'accessed': {
        'date-parts': [['2010', '7', '26']]
    }
};
exports.ALLOWED_OUTPUT_FORMATS = {
    "html": "html",
    "text": "text",
    "asciidoc": "asciidoc",
    "fo": "fo",
    "rtf": "rtf",
};
exports.defaultRenderOptions = {
    batched: false,
    outputFormat: "html",
    localePath: 'locales-en-US.xml',
    stylePath: 'apa.csl',
};
function renderCitation(citation, options = exports.defaultRenderOptions) {
    const { outputFormat, lang, stylePath, localePath } = Object.assign(Object.assign({}, exports.defaultRenderOptions), options);
    const sys = {
        retrieveLocale: (RFC_5646_language_tag) => {
            return utils_1.readXML(localePath);
        },
        retrieveItem: (id) => {
            return Object.assign({ id }, citation);
        },
    };
    const styleXML = utils_1.readXML(stylePath);
    const citeproc = new csl.Engine(sys, styleXML, lang);
    citeproc.setOutputFormat(outputFormat);
    citeproc.updateItems(["citation1"]);
    const [, result] = citeproc.makeBibliography();
    return result[0].trim();
}
exports.renderCitation = renderCitation;
