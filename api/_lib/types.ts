export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    text: string;
    tvl: string;
    percentChange: string;
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
    heights: string[];
}
