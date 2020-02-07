import * as fs from 'fs';
import * as path from 'path';
import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';

export function readFile(path) {
  return fs.readFileSync(path).toString();
}

export const readXML = readFile;

export function localePathForLang(lang: string): string {
  const localeName = LANGUAGE_TO_LOCALE_MAP[lang];
  return path.join(__dirname, `../locales/locales-${localeName}.xml`);
}

export function pathForLocale(locale: string): string {
  if (locale !== path.basename(locale)) return locale;
  return path.join(__dirname, `../locales/locales-${locale}.xml`);
}

export function pathForStyle(style: string): string {
  if (style !== path.basename(style)) return style;
  const styleName = STYLES_ABBREVIATIONS[style];
  return path.join(__dirname, `../styles/${styleName}.csl`);
}
