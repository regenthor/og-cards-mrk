export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    valueHeader: string;
    tvl: string;
    volumeChange: string;
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
