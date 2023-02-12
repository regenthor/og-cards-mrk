
import { readFileSync } from 'fs';
import { sanitizeHtml } from './sanitizer';
import { ParsedRequest, IRenderContent, IRenderWithPrice, IRenderToken } from './types';


const rglr = readFileSync(`${__dirname}/../_fonts/Poppins-Regular.woff2`).toString('base64');
const bold = readFileSync(`${__dirname}/../_fonts/Poppins-SemiBold.woff2`).toString('base64');
const dark_bg_protocol_url = `https://raw.githubusercontent.com/regenthor/markr-og-images/main/theme/markr-og-card-filled.png`;
const dark_bg_token_url = `https://raw.githubusercontent.com/regenthor/markr-og-images/main/theme/markr-og-card-red.png`;
const dark_default_url = `https://raw.githubusercontent.com/regenthor/markr-og-images/main/theme/markr-og-card-red.png`;

function getCss(theme: string, type: string) {
    let fontColor = "#000000"
    let keynoteColor = "#e84344";
    let bg_url = dark_default_url;

    if (type == "token") {
        bg_url = dark_bg_token_url;
        keynoteColor = "#000000";
    } else if (type == "protocols") {
        bg_url = dark_bg_protocol_url;
    }

    if (theme === 'dark') {
        fontColor = "#FFFFFF";
    }

    return `
    @font-face {
        font-family: 'Poppins';
        font-style:  normal;
        font-weight: normal;
        src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
    }

    @font-face {
        font-family: 'Poppins';
        font-style:  normal;
        font-weight: bold;
        src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
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
        justify-content:space-between;
        height: 100vh;
        padding: 48px;
        background-image: url(${bg_url});
        background-size: cover;
        font-family: 'Poppins', sans-serif;
        font-style: normal;
        letter-spacing: -0.01em;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .tvl-text-width {
        width:60%;
    }

    .token-text-width {
        width:100%;
    }

    .header .description-tvl {
        color: ${fontColor};
        font-family: Poppins;
        display:flex;
        padding: 0rem;
        height: min-content;
        font-size: 3rem;
        font-weight: 500;
        span {
            margin: 0px !important;
        }
    }

    .margin-auto {
        margin: auto;
    }

    .keynote {
        color: ${keynoteColor};
    }
    .theme-text {
        color: ${fontColor} !important;
    }
    .main .app-icon {
            height:125px;
            width:125px;
            border-radius:100%;
            display:flex;
            align-items:center;
            justify-content:center;
            margin-right:75px;
    }

    .main .app-icon  img {
        height:100%;
        width: 100%;
        border-radius:100%;
    }

    .default-icon {
        height: 175px !important;
        width: 175px !important; 
    }

    .main .title {
        font-weight:400;
        font-size: 1rem;
        color: ${fontColor};
    }
    .main .value {
        font-size: 3.5rem;
        color: ${fontColor};
    }
    .flex {
        display:flex;
    }
    .wrap-div {
        flex-direction:column;
    }
    .items-center {
        align-items:center;
    }
    .font-bold {
        font-weight:600;
    }
    .font-medium {
        font-weight:500 !important; 
    }
    .logo-footer {
        height:75px;
        width:100%;
        display:flex;
        justify-content:flex-end;
    }
    .logo-footer .markr-logo {
        height:75px;
        width:75px;
    }
    .text-uppercase {
        text-transform: uppercase;
    }
    .justify-center {
        justify-content: center;
    }
    .flex-col {
        flex-direction: column;
    }
    .full-size {
        height:100%;
        width:100%;
    }
    .space-around {
            justify-content: space-around;
    }
    .mr-0 {
        margin-right:0px !important;
    }
    `;
}

export function getHtml(parsedReq: ParsedRequest) {
    const { cardName, volume, type, tvl, address, theme, md, chainId } = parsedReq;

    return `<!DOCTYPE html>
            <html>
                <meta charset="utf-8">
                <title>Generated Image</title>
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    ${getCss(theme, type)}
                </style>
                <body>
                    ${renderContent({ cardName, volume, type, tvl, address, theme, md, chainId })}
                </body>
            </html>`;
}

function getTokenImage(address: string, chainId: string, className = 'logo') {
    const root = `https://raw.githubusercontent.com/satatocom/markr-tokens/master/${chainId}/${address}/logo.png`;
    return `<img
        class="${sanitizeHtml(className)}"
        src="${root}"
        onerror="this.onerror=null; this.remove();"
    />`
}
function getProtocolImage(src: string, height = '80', className = 'logo', type: string) {

    const root = `https://raw.githubusercontent.com/satatocom/markr-tokens/master/${type}/${src}/logo.png`
    return `<img
        class="${sanitizeHtml(className)}"
        src="${root}"
        width="auto"
        height="${sanitizeHtml(height)}"
        onerror="this.onerror=null; this.remove();"
    />`
}

function renderContent({ cardName, volume, type, tvl, address, md, chainId }: IRenderContent) {
    if (type == "default") {
        return renderOnlyLogo();
    } else if (type == "token") {
        return renderToken({ cardName, address, type, volume, md, chainId })
    } else if (type == "protocols") {
        return renderTvl({ cardName, type, tvl, address })
    } else if (cardName != undefined) {
        return renderOnlyCardNameLogo(cardName);
    } else {
        return renderOnlyLogo();
    }
}


function getMarkrLogo() {
    const url = "https://raw.githubusercontent.com/regenthor/markr-og-images/main/theme/logos/markr-logo.png";
    return `
      <img
        class="markr-logo"
        src="${url}"
        onerror="this.onerror=null; this.remove();"
    />
    `
}

function renderOnlyLogo() {
    return `<div class="flex items-center justify-center flex-col full-size" style="position:relative;"> 
                <div class="main flex items-center token-text-width justify-center">
                    <div class="app-icon default-icon mr-0">
                        ${getMarkrLogo()}
                    </div>
                </div>
            </div>`
}

function renderOnlyCardNameLogo(cardName: any) {
    return `<div class="flex items-center justify-center flex-col full-size" style="position:relative;"> 
                <div class="header">
                    <div class="description-tvl token-text-width flex-col justify-center items-center">
                        <span class="">${cardName}</span>
                    </div>
                </div>
                <div class="main flex items-center token-text-width justify-center" style="padding-top:1rem;">
                    <div class="app-icon mr-0">
                        ${getMarkrLogo()}
                    </div>
                </div>
            </div>`
}
// <div class="logo-footer" >
//     ${ getMarkrLogo() }
// </div>
function renderToken({ cardName, address, volume, chainId }: IRenderToken) {
    return `<div class="flex items-center space-around flex-col full-size" style="position:relative;"> 
                <div class="header">
                    <div class="description-tvl margin-auto token-text-width flex-col justify-center items-center">
                        <span>Token Update</span>
                        <span class="keynote font-bold">${cardName}, <span class="theme-text font-medium">available on Markr.</span> </span>
                    </div>
                </div>
                <div class="main flex items-center" style="padding-bottom:48px;">
                    <div class="app-icon">
                        ${getTokenImage(address, chainId, "logo")}
                    </div>
                    <div class="flex wrap-div">
                            <div class="title">Total Volume</div>
                            <div class="value bold-font text-uppercase">${sanitizeHtml(volume)}</div>
                    </div>
                </div>
                <div class="logo-footer" style="position:absolute; bottom:48px; left:0px; padding-right:48px;">
                        ${getMarkrLogo()}
                </div>
            </div>
    `
}

function renderTvl({ cardName, tvl, address, type }: IRenderWithPrice) {
    console.log("Address: ", address);
    return `<div class="header">
                <div class="description-tvl tvl-text-width">
                    <span>${cardName}, <span class="keynote">available on Markr.</span> </span>
                </div>
            </div>
            <div class="main flex items-center">
                <div class="app-icon"> 
                    ${getProtocolImage(address, "120", "logo", type)}
                </div>
                <div class="flex wrap-div">
                        <div class="title">Total Value Locked</div>
                        <div class="value bold-font text-uppercase">${sanitizeHtml(tvl)}</div>
                </div>
                </div>
            </div>
            <div class="logo-footer">
                ${getMarkrLogo()}
            </div>
            `
}