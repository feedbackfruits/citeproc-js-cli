import { STYLES_ABBREVIATIONS } from './style';
import { LANGUAGE_TO_LOCALE_MAP } from './locale';
export declare const token_article_dict: {
    'type': string;
    'title': string;
    'container-title': string;
    'page': string;
    'volume': string;
    'issue': string;
    'source': string;
    'abstract': string;
    'URL': string;
    'DOI': string;
    'ISSN': string;
    'author': {
        'family': string;
        'given': string;
    }[];
    'issued': {
        'date-parts': string[][];
    };
    'accessed': {
        'date-parts': string[][];
    };
};
export declare const ALLOWED_OUTPUT_FORMATS: {
    "html": string;
    "text": string;
    "asciidoc": string;
    "fo": string;
    "rtf": string;
};
export declare type RenderOptions = {
    batched: boolean;
    outputFormat?: keyof typeof ALLOWED_OUTPUT_FORMATS;
    lang?: keyof typeof LANGUAGE_TO_LOCALE_MAP;
    style?: keyof typeof STYLES_ABBREVIATIONS;
    localePath?: string;
    stylePath?: string;
};
export declare const defaultRenderOptions: RenderOptions;
export declare function renderCitation(citation: Object, options?: RenderOptions): any;
