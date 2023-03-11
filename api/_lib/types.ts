export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    diff: string;
    tvl: string;
    type: string;
    address: string;
    chainName: string;
    volume: string;
    chainId: string;
    theme: Theme;
    md: boolean;
}
export interface IRenderContent {
    cardName?: string;
    volume: string;
    diff: string;
    chainId: string;
    chainName?: any;
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
    chainName?: any;
    type: string;
}

export interface IRenderPair {
    cardName?: string;
    tvl: string;
    chainName: string;
    address: string;
    type: string;
    chainId: string;
}

export interface IRenderToken {
    cardName?: string;
    chainId: string;
    chainName: string;
    address: string;
    type: string;
    md: boolean;
    diff: string;
    volume: string;
}