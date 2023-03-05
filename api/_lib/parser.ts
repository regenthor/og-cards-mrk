import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest } from './types';

export function parseRequest(req: IncomingMessage) {
    const { pathname, query } = parse(req.url || '/', true);
    const { address, theme, md, volume, tvl, type, chainId } = (query || {});

    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }

    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let cardName = '';
    if (arr.length === 0) {
        cardName = '';
    } else if (arr.length === 1) {
        cardName = arr[0];
    } else {
        extension = arr.pop() as string;
        cardName = arr.join('.');
    }

    cardName = cardName.replace("_", " ");


    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        address: getString(address),
        cardName: cardName,
        tvl: getString(tvl),
        chainId: getString(chainId),
        type: getString(type),
        volume: getString(volume),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
    };
    return parsedRequest;
}

// function getArray(stringOrArray: string[] | string | undefined): string[] {
//     if (typeof stringOrArray === 'undefined') {
//         return [];
//     } else if (Array.isArray(stringOrArray)) {
//         return stringOrArray;
//     } else {
//         return [stringOrArray];
//     }
// }

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



