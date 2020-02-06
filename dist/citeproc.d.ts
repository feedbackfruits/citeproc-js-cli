import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';
export declare const ALLOWED_OUTPUT_FORMATS: {
    "html": string;
    "text": string;
    "asciidoc": string;
    "fo": string;
    "rtf": string;
};
export declare type RenderOptions = {
    outputFormat?: keyof typeof ALLOWED_OUTPUT_FORMATS;
    lang?: keyof typeof LANGUAGE_TO_LOCALE_MAP;
    style?: keyof typeof STYLES_ABBREVIATIONS;
};
export declare const defaultRenderOptions: RenderOptions;
export declare function renderCitation(citation: Object, options?: RenderOptions): any;
