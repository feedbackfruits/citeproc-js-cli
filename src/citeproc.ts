import * as csl from 'citeproc';
import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';
import { readXML } from './utils';
import { v4 as uuidv4 } from 'uuid';

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
  "html": "html",
  "text": "text",  // Default
  "asciidoc": "asciidoc",
  "fo": "fo",
  "rtf": "rtf",
};

export type RenderOptions = {
  batched: boolean,
  outputFormat?: keyof typeof ALLOWED_OUTPUT_FORMATS,
  lang?: keyof typeof LANGUAGE_TO_LOCALE_MAP,
  style?: keyof typeof STYLES_ABBREVIATIONS,
  localePath?: string,
  stylePath?: string,
};

export const defaultRenderOptions: RenderOptions = {
  batched: false,
  outputFormat: "text",
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

export function renderInTextCitations(bibliography: Object[], citations: Object[], options: RenderOptions = defaultRenderOptions) {
  const { outputFormat, lang, stylePath, localePath } = { ...defaultRenderOptions, ...options };
  const bibliographyMap = bibliography.reduce((memo, _reference) => {
    const id = uuidv4();
    const reference = { id, ..._reference };
    memo[reference["id"]] = reference;
    return memo;
  }, {});
  const bibliographyWithId = Object.values(bibliographyMap);

  let citedReferenceIds = {};
  const citationsWithId = citations.map((citation, index) => {
    const id = uuidv4();
    const referenceIds = citation['reference_indices'].map(index => bibliographyWithId[index]["id"]);
    const citationItems = referenceIds.map(id => ({ id }));
    citedReferenceIds = { ...citedReferenceIds, ...referenceIds.map(id => ({ [id]: true })) };

    return {
      id,
      citationID: id,
      ...citation,
      properties: {
        noteIndex: index + 1
      },
      citationItems
    }
  });

  const sys = {
    retrieveLocale: (RFC_5646_language_tag) => {
      return readXML(localePath);
    },
    retrieveItem: (id) => {
      return bibliographyMap[id];
    },
  };

  const styleXML = readXML(stylePath);
  const citeproc = new csl.Engine(sys, styleXML, lang);

  citeproc.setOutputFormat(outputFormat);

  const { results } = citationsWithId.reduce((memo, citation, index) => {
    const [ status, citationResults ] = citeproc.processCitationCluster(citation, memo.citationsPre, memo.citationsPost);

    const results = citationResults.reduce((memo, result) => {
      const [ index, rendered, id ] = result;
      memo[id] = rendered;
      return memo;
    }, { ...memo.results });

    const uncitedReferenceIds = Object.keys(bibliographyMap).filter(key => !(key in citedReferenceIds));
    citeproc.updateUncitedItems(uncitedReferenceIds);

    return {
      results: results,
      citationsPre: [ ...memo.citationsPre, [ citation["id"], index + 1 ] ],
      citationsPost: [],
    };
  }, { citationsPre: [], citationsPost: [], results: {} });

  const [ formattingParameters, renderedBibliography ] = citeproc.makeBibliography();

  const result = {
    bibiography: {
      outputFormat,
      formattingParameters,
      renderedBibliography
    },
    citations: results
  }

  return result;
}
