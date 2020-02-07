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
exports.defaultBibliographyOptions = {
    file: '/dev/stdin',
    lang: 'en',
    style: 'apa',
    outputFormat: 'html',
};
function parseOptions(argv) {
    const file = (argv['file'] === true || argv['file'] === '-') ? "/dev/stdin" : argv['file'];
    return Object.assign(Object.assign({}, exports.defaultBibliographyOptions), { file });
}
exports.parseOptions = parseOptions;
function bibliography(argv) {
    console.log(argv);
    const options = parseOptions(argv);
    const { file } = options;
    const fileString = utils_1.readFile(file);
    const json = JSON.parse(fileString);
    if (!file)
        yargs.showHelp();
    else {
        const result = citeproc_1.renderCitation(json, { outputFormat: "text" });
        console.log(result);
    }
}
exports.bibliography = bibliography;
yargs
    .usage('Usage: $0 [bibliography] [file] [options]')
    .example('cat reference.json | $0 bibliography -', 'count the lines in the given file')
    .option('i', {
    desc: 'Input file',
    alias: ['input', 'input-file', 'in', 'file']
})
    .option('o', {
    desc: 'Output format',
    alias: ['output', 'output-format', 'out', 'format']
})
    .option('s', {
    desc: 'Style',
    alias: ['style']
})
    .option('l', {
    desc: 'Language',
    alias: ['lang', 'language']
})
    .option('L', {
    desc: 'Locale',
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
    .command(['bibliography [file] [options]'], 'Render a bibliography from a file ( - or /dev/stdin for stdin)', (args) => {
    return args
        .usage('Usage: $0 bibliography [file] [options]');
}, bibliography)
    .demandCommand()
    .help('h')
    .alias('h', 'help')
    .wrap(120)
    .argv;
