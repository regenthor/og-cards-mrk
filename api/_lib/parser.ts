import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';
import { readFileSync } from 'fs';

const logo = readFileSync(`${__dirname}/../_assets/logo.svg`).toString('base64');


export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { footerURL, fontSize, images, widths, heights, theme, md, tvl, percentChange } = (query || {});

    if (Array.isArray(fontSize)) {
        throw new Error('Expected a single fontSize');
    }
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
        fontSize: fontSize || '96px',
        images: getArray(images),
        widths: getArray(widths),
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
        ? logo
        : logo;

    if (!images || !images[0]) {
        return [defaultImage];
    }

    // if (!images[0].startsWith('https://assets.vercel.com/') && !images[0].startsWith('https://assets.zeit.co/')) {
    //     images[0] = defaultImage;
    // }

    return images;
}

