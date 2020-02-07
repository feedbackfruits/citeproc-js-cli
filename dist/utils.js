"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const style_1 = require("./style");
const locale_1 = require("./locale");
function readFile(path) {
    return fs.readFileSync(path).toString();
}
exports.readFile = readFile;
exports.readXML = readFile;
function localePathForLang(lang) {
    const localeName = locale_1.LANGUAGE_TO_LOCALE_MAP[lang];
    return path.join(__dirname, `../locales/locales-${localeName}.xml`);
}
exports.localePathForLang = localePathForLang;
function pathForLocale(locale) {
    if (locale !== path.basename(locale))
        return locale;
    return path.join(__dirname, `../locales/locales-${locale}.xml`);
}
exports.pathForLocale = pathForLocale;
function pathForStyle(style) {
    if (style !== path.basename(style))
        return style;
    const styleName = style_1.STYLES_ABBREVIATIONS[style];
    return path.join(__dirname, `../styles/${styleName}.csl`);
}
exports.pathForStyle = pathForStyle;
