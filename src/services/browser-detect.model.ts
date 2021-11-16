export enum BrowsersEnum {
    edge = 'MS Edge',
    ei = 'Internet Explorer',
    firefox = 'Firefox',
    opera = 'Opera',
    chrome = 'Chrome',
    safari = 'Safari'
}

export interface IBrowserData {
    substr: string;
    identity: BrowsersEnum;
}

export const browserData: IBrowserData[] = [
    { substr: 'Edge', identity: BrowsersEnum.edge },
    { substr: 'Edg', identity: BrowsersEnum.edge },
    { substr: 'MSIE', identity: BrowsersEnum.ei },
    { substr: 'Trident', identity: BrowsersEnum.ei },
    { substr: 'Firefox', identity: BrowsersEnum.firefox },
    { substr: 'Opera', identity: BrowsersEnum.opera },
    { substr: 'OPR', identity: BrowsersEnum.opera },
    { substr: 'Chrome', identity: BrowsersEnum.chrome },
    { substr: 'Safari', identity: BrowsersEnum.safari }
];
