import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { footerURL, images, heights, theme, md, tvl, percentChange } = (query || {});

    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let text = '';
    if (arr.length === 0) {
        text = '';
    } else if (arr.length === 1) {
        text = arr[0];
    } else {
        extension = arr.pop() as string;
        text = arr.join('.');
    }

    let url = getString(footerURL);
    let totalValue = getString(tvl);
    let percentageChange = getString(percentChange)
    
    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        text: decodeURIComponent(text),
        tvl: totalValue,
        percentChange: percentageChange,
        footerURL: decodeURIComponent(url),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        images: getArray(images),
        heights: getArray(heights),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getString(stringOrArray: string[] | string | undefined) {
    if (stringOrArray && Array.isArray(stringOrArray)) {
        if (stringOrArray.length === 0) {
            return ''
        } else {
            return stringOrArray[0]
        }
    } else {
        return stringOrArray ?? ''
    }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    const defaultImage = theme === 'light'
        ? "https://raw.githubusercontent.com/DefiLlama/defillama-press-kit/master/SVG/defillama.svg"
        : "https://raw.githubusercontent.com/DefiLlama/defillama-press-kit/master/SVG/defillama-dark.svg";

    if (!images || !images[0]) {
        return [defaultImage];
    }

    return images;
}

