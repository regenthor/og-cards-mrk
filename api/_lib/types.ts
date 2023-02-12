export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    tvl: string;
    type: string;
    address: string;
    volume: string;
    chainId: string;
    theme: Theme;
    md: boolean;
}
export interface IRenderContent {
    cardName?: string;
    volume: string;
    chainId: string;
    address: string;
    md: boolean;
    tvl: string;
    theme: string;
    type: string;
}

export interface IRenderWithPrice {
    cardName?: string;
    tvl: string;
    address: string;
    type: string;
}
export interface IRenderToken {
    cardName?: string;
    chainId: string;
    address: string;
    type: string;
    md: boolean;
    volume: string;
}