import * as yargs from "yargs";
export declare type BibliographyOptions = {
    file: string;
    lang: string;
    style: string;
    outputFormat: string;
};
export declare const defaultBibliographyOptions: BibliographyOptions;
export declare function parseOptions(argv: typeof yargs.argv): BibliographyOptions;
export declare function bibliography(argv: typeof yargs.argv): void;
