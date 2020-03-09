import * as yargs from "yargs";
import { renderCitation, RenderOptions } from "./citeproc";
import { readFile, localePathForLang, pathForLocale, pathForStyle } from './utils';

export function parseOptions(argv: typeof yargs.argv): RenderOptions {
  const outputFormat = 'out' in argv ? argv['out'] as any : "text";
  const stylePath = 'style' in argv ? pathForStyle(argv['style'] as string) as any : undefined;
  const localePath = 'locale' in argv ? pathForLocale(argv['locale'] as string) as any :
    'lang' in argv ? localePathForLang(argv['lang'] as string) as any : undefined;

  const batched = 'batch' in argv && !!argv['batch'];

  return {
    batched,
    outputFormat,
    ...(stylePath ? { stylePath } : {}),
    ...(localePath ? { localePath } : {}),
  }
}

export function bibliography(argv: typeof yargs.argv) {
  // console.log(argv);

  const file = (argv['file'] === true || argv['file'] === '-') ? "/dev/stdin" : argv['file'] as string;
  const options = parseOptions(argv);

  if (!file) yargs.showHelp();
  else {
    const fileString = readFile(file);
    if (options.batched) {
      const jsons = fileString.trim().split('\n')
      const results = jsons.map(jsonString => {
        const json = JSON.parse(jsonString);
        return renderCitation(json, options);
      })

      console.log(results.join('\n'));

    } else {
      const json = JSON.parse(fileString);

      const result = renderCitation(json, options);
      console.log(result);
    }
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
    desc: 'Style or path to style',
    alias: [ 'style' ]
  })
  .option('l', {
    desc: 'Language (only used if locale is unspecified)',
    alias: [ 'lang', 'language' ]
  })
  .option('L', {
    desc: 'Locale or path to locale',
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
  .option('BOS', {
    desc: 'Batch output-separator',
    alias: [ 'batch-output-separator' ],
    default: '\\n'
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
