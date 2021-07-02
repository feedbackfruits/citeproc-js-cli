import * as yargs from "yargs";
import { RenderOptions } from "./citeproc";
export declare function parseOptions(argv: typeof yargs.argv): RenderOptions;
export declare function bibliography(argv: typeof yargs.argv): void;
export declare function citations(argv: typeof yargs.argv): void;
