"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
const citeproc_1 = require("./citeproc");
const utils_1 = require("./utils");
function parseOptions(argv) {
    const outputFormat = 'out' in argv ? argv['out'] : "text";
    const stylePath = 'style' in argv ? utils_1.pathForStyle(argv['style']) : undefined;
    const localePath = 'locale' in argv ? utils_1.pathForLocale(argv['locale']) :
        'lang' in argv ? utils_1.localePathForLang(argv['lang']) : undefined;
    const batched = 'batch' in argv && !!argv['batch'];
    return Object.assign(Object.assign({ batched,
        outputFormat }, (stylePath ? { stylePath } : {})), (localePath ? { localePath } : {}));
}
exports.parseOptions = parseOptions;
function bibliography(argv) {
    const file = (argv['file'] === true || argv['file'] === '-') ? "/dev/stdin" : argv['file'];
    const options = parseOptions(argv);
    if (!file)
        yargs.showHelp();
    else {
        const fileString = utils_1.readFile(file);
        if (options.batched) {
            const jsons = fileString.trim().split('\n');
            const results = jsons.map(jsonString => {
                const json = JSON.parse(jsonString);
                return citeproc_1.renderCitation(json, options);
            });
            console.log(results.join('\n'));
        }
        else {
            const json = JSON.parse(fileString);
            const result = citeproc_1.renderCitation(json, options);
            console.log(result);
        }
    }
}
exports.bibliography = bibliography;
function citations(argv) {
    const file = (argv['file'] === true || argv['file'] === '-') ? "/dev/stdin" : argv['file'];
    const options = parseOptions(argv);
    if (!file)
        yargs.showHelp();
    else {
        const fileString = utils_1.readFile(file);
        const jsonStrings = fileString.trim().split('\n');
        const jsons = jsonStrings.map(str => JSON.parse(str));
        const isCitation = json => 'type' in json && json.type == 'citation';
        const bibliography = jsons.filter(json => !isCitation(json));
        const citations = jsons.filter(isCitation);
        const result = citeproc_1.renderInTextCitations(bibliography, citations, options);
        console.log(JSON.stringify(result));
    }
}
exports.citations = citations;
yargs
    .usage('Usage: $0 [bibliography|citations] [file] [options]')
    .example('cat reference.json | $0 bibliography -', 'Render a bibliography from stdin')
    .example('cat reference.json | $0 citations -', 'Render in-text citations from stdin')
    .option('i', {
    desc: 'Input file',
    alias: ['input', 'input-file', 'in', 'file']
})
    .option('o', {
    desc: 'Output format',
    alias: ['output', 'output-format', 'out', 'format'],
    default: 'text'
})
    .option('s', {
    desc: 'Style or path to style',
    alias: ['style']
})
    .option('l', {
    desc: 'Language (only used if locale is unspecified)',
    alias: ['lang', 'language']
})
    .option('L', {
    desc: 'Locale or path to locale',
    alias: ['locale']
})
    .option('B', {
    desc: 'Batch',
    alias: ['batch'],
    boolean: true
})
    .option('BF', {
    desc: 'Batch-format',
    alias: ['batch-format'],
    default: 'JSON'
})
    .option('BOS', {
    desc: 'Batch output-separator',
    alias: ['batch-output-separator'],
    default: '\\n'
})
    .command(['bibliography [file] [options]'], 'Render a bibliography from a file ( - or /dev/stdin for stdin)', (args) => {
    return args
        .usage('Usage: $0 bibliography [file] [options]');
}, bibliography)
    .command(['citations [file] [options]'], 'Render in-text citations from a file ( - or /dev/stdin for stdin)', (args) => {
    return args
        .usage('Usage: $0 citations [file] [options]');
}, citations)
    .demandCommand()
    .help('h')
    .alias('h', 'help')
    .wrap(120)
    .argv;
