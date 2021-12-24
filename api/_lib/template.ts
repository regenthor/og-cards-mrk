
import { readFileSync } from 'fs';
import marked from 'marked';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest } from './types';
const twemoji = require('twemoji');
const twOptions = { folder: 'svg', ext: '.svg' };
const emojify = (text: string) => twemoji.parse(text, twOptions);

const rglr = readFileSync(`${__dirname}/../_fonts/Inter-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Inter-Bold.woff2`).toString('base64');
const mono = readFileSync(`${__dirname}/../_fonts/Vera-Mono.woff2`).toString('base64');

function getCss(theme: string, renderOnlyLogo: boolean, tvlExists: boolean, isChangePositive: boolean) {
    let background = 'white';
    let foreground = 'black';

    if (theme === 'dark') {
        background = '#262938';
        foreground = '#FFFFFF';
    }

    return `
    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Inter';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
    }

    @font-face {
        font-family: 'Vera';
        font-style: normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
      }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    * {
        margin: 0;
    }

    body {
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 100px;
        background: ${background};
        font-family: 'Inter', sans-serif;
        font-style: normal;
        letter-spacing: -0.01em;
    }

    code {
        color: #D400FF;
        font-family: 'Vera';
        white-space: pre-wrap;
        letter-spacing: -5px;
    }

    code:before, code:after {
        content: '\`';
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex: ${!tvlExists || renderOnlyLogo ? "1" : 0};
    }

    .header .details {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: ${foreground};
        line-height: 1.8;
        overflow: hidden;
    }

    .header .details .name {
        font-weight: 600;
        font-size: 80px;
        line-height: 99px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .logo {
        margin: ${renderOnlyLogo ? "auto" : 0};
        flex: ${renderOnlyLogo ? "1" : 0};
        margin-left: ${renderOnlyLogo ? "0px" : "100px"};
    }

    .tokenLogo {
        margin-right: 32px;
        border-radius: 50%;
    }

    .main {
        padding: 76px;
        padding-bottom: 40px;
        background: ${theme === "dark" ? "#1C1F2E" : "rgba(230, 232, 248, 0.6)"};
        margin: auto 0;
        width: fit-content;
        min-width: 70%;
        border-radius: 40px;
        display: ${!tvlExists || renderOnlyLogo ? "none" : "revert"};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .main .title {
        font-weight: 500;
        font-size: 56px;
        line-height: 70px;
        color: ${theme === "dark" ? "#777B92" : "#8C90B0"};
    }

    .main .details {
        margin-top: 44px;
        display: flex;
        align-items: baseline;
    }

    .main .details .value {
        font-weight: 600;
        font-size: 196px;
        line-height: 240px;
        color: ${theme === "dark" ? "#FFFFFF" : "#213295"};
        margin-right: 70px;
    }

    .main .details .change {
        font-weight: 600;
        font-size: 84px;
        line-height: 100px;
        color: ${isChangePositive ? "#4BA433" : "#FF3F28"};
    }

    .change svg {
        height: 84px;
        width: 84px;
        position: relative;
        top: 14px;
        right: -16px;
    }
    
    .footer {
        font-style: italic;
        font-weight: normal;
        font-size: 44px;
        line-height: 72px;
        color: ${theme === "dark" ? "rgba(149, 153, 171, 0.9)" : "#575A68"};
        margin-bottom: -16px;
    }
    
    .spacer {
        margin: 150px;
    }

    .emoji {
        height: 1em;
        width: 1em;
        margin: 0 .05em 0 .1em;
        vertical-align: -0.1em;
    }`;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { text, tvl, percentChange, footerURL, theme, md, images, heights } = parsedReq;
    // render only logo, if there is no text, and if there is no additional image selected
    const renderOnlyLogo =  !text && images.length === 1;
    const tvlExists = tvl ? true : false;
    const isChangePositive = percentChange?.includes("+") ?? false;
    const isChangeNegative = percentChange?.includes("-") ?? false;

    let trend;

    if (isChangePositive) {
        trend = percentChange.split("+")[1]
    } else if (isChangeNegative) {
        trend = percentChange.split("-")[1]
    } else {
        trend = percentChange || ""
    }

    return `<!DOCTYPE html>
            <html>
                <meta charset="utf-8">
                <title>Generated Image</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    ${getCss(theme, renderOnlyLogo, tvlExists, isChangePositive)}
                </style>
                <body>
                    <div class="header">
                        <div class="details">
                            ${images[1] ? getImage(images[1], heights[1], "tokenLogo") : ""}
                            <div class="name">${emojify(
                                md ? marked(text) : sanitizeHtml(text)
                            )}</div>
                        </div>
                        ${getImage(images[0], heights[0], "logo")}
                    </div>
                    <div class="main">
                        <div class="title">Total Value Locked</div>
                        <div class="details">
                            <div class="value">${sanitizeHtml(tvl)}</div>
                            <div class="change">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d=${isChangePositive ? `"M7 11l5-5m0 0l5 5m-5-5v12"` : `"M17 13l-5 5m0 0l-5-5m5 5V6"`} />
                                </svg>
                                ${sanitizeHtml(trend)}
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        Defi Llama is committed to providing accurate data without advertisements or sponsored content, as well as transparency. Learn more on :
                        ${emojify(
                            md ? marked(footerURL) : sanitizeHtml(footerURL || "https://defillama.com")
                        )}
                    </div>
                </body>
            </html>`;
    }

function getImage(src: string, width ='auto', height = '150', className = 'logo') {
    return `<img
        class="${sanitizeHtml(className)}"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
        onerror="this.onerror=null; this.remove();"
    />`
}
