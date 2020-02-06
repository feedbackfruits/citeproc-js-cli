import { renderCitation } from './citeproc';

const token_article_dict = {
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

const result = renderCitation(token_article_dict, { outputFormat: "text" });
console.log(result);