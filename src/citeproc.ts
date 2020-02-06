import * as csl from 'citeproc';
import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';
import { readXML } from './utils';

export const ALLOWED_OUTPUT_FORMATS = {
  "html": "html", // Default
  "text": "text",
  "asciidoc": "asciidoc",
  "fo": "fo",
  "rtf": "rtf",
};

export type RenderOptions = {
  outputFormat?: keyof typeof ALLOWED_OUTPUT_FORMATS,
  lang?: keyof typeof LANGUAGE_TO_LOCALE_MAP,
  style?: keyof typeof STYLES_ABBREVIATIONS,
};

export const defaultRenderOptions: RenderOptions = {
  outputFormat: "html",
  lang: "en",
  style: "apa",
};


export function renderCitation(citation: Object, options: RenderOptions = defaultRenderOptions) {
  const { outputFormat, lang, style } = { ...defaultRenderOptions, ...options };
  const sys = {
    retrieveLocale: (RFC_5646_language_tag) => {
      return readXML('locales-en-US.xml')
    },
    retrieveItem: (id) => {
      return {
        id,
        ...citation
      };
    },
  };

  const styleXML = readXML(`${style}.csl`);
  const citeproc = new csl.Engine(sys, styleXML, lang);

  citeproc.setOutputFormat(outputFormat);
  citeproc.updateItems([ "citation1" ]);

  const [ , result ] = citeproc.makeBibliography();
  return result[0].trim();
}
