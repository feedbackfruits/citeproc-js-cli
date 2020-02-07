import * as csl from 'citeproc';
import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';
import { readXML } from './utils';

export const token_article_dict = {
  'type': 'article-journal',
  // # 'language': 'en',
  'title': 'The varieties of capitalism and hybrid success',
  'container-title':  'Comparative Political Studies',
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
  localePath?: string,
  stylePath?: string,
};

export const defaultRenderOptions: RenderOptions = {
  outputFormat: "html",
  localePath: 'locales-en-US.xml',
  stylePath: 'apa.csl',
  // lang: "en",
  // style: "apa",
};

export function renderCitation(citation: Object, options: RenderOptions = defaultRenderOptions) {
  const { outputFormat, lang, stylePath, localePath } = { ...defaultRenderOptions, ...options };
  const sys = {
    retrieveLocale: (RFC_5646_language_tag) => {
      // return readXML('locales-en-US.xml')
      return readXML(localePath);
    },
    retrieveItem: (id) => {
      return {
        id,
        ...citation
      };
    },
  };

  // const styleXML = readXML(`${style}.csl`);
  const styleXML = readXML(stylePath);
  const citeproc = new csl.Engine(sys, styleXML, lang);

  citeproc.setOutputFormat(outputFormat);
  citeproc.updateItems([ "citation1" ]);

  const [ , result ] = citeproc.makeBibliography();
  return result[0].trim();
}
