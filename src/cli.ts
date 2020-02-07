import * as yargs from "yargs";
import { renderCitation, token_article_dict } from "./citeproc";
import { readFile } from './utils';

export type BibliographyOptions = {
  file: string,
  lang: string,
  style: string,
  outputFormat: string,
};
export const defaultBibliographyOptions: BibliographyOptions = {
  file: '/dev/stdin',
  lang: 'en',
  style: 'apa',
  outputFormat: 'html',
};
export function parseOptions(argv: typeof yargs.argv): BibliographyOptions {
  const file = (argv['file'] === true || argv['file'] === '-') ? "/dev/stdin" : argv['file'] as string;

  return {
    ...defaultBibliographyOptions,
    file
  }
}

export function bibliography(argv: typeof yargs.argv) {
  console.log(argv);

  const options = parseOptions(argv);
  const { file } = options;

  const fileString = readFile(file);
  // console.log(fileString);
  const json = JSON.parse(fileString);

  if (!file) yargs.showHelp();
  else {
    const result = renderCitation(json, { outputFormat: "text" });
    console.log(result);
  }
}

yargs
  .usage('Usage: $0 [bibliography] [file] [options]')
  .example('cat reference.json | $0 bibliography -', 'count the lines in the given file')
  .option('i', {
    desc: 'Input file',
    alias: [ 'input', 'input-file', 'in', 'file' ]
  })
  .option('o', {
    desc: 'Output format',
    alias: [ 'output', 'output-format', 'out', 'format' ]
  })
  .option('s', {
    desc: 'Style',
    alias: [ 'style' ]
  })
  .option('l', {
    desc: 'Language',
    alias: [ 'lang', 'language' ]
  })
  .option('L', {
    desc: 'Locale',
    alias: [ 'locale' ]
  })
  .option('B', {
    desc: 'Batch',
    alias: [ 'batch' ],
    boolean: true
  })
  .option('BF', {
    desc: 'Batch-format',
    alias: [ 'batch-format' ],
    default: 'JSON'
  })
  .command([ 'bibliography [file] [options]' ], 'Render a bibliography from a file ( - or /dev/stdin for stdin)', (args) => {
    return args
      .usage('Usage: $0 bibliography [file] [options]')
  }, bibliography)
  .demandCommand()
  .help('h')
  .alias('h', 'help')
  .wrap(120)
  .argv;
