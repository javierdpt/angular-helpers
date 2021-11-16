
export enum ErrorCodesEnum {
    badRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
    methodNotSupported = 405,
    internalServerError = 500,
    comingSoon = 'coming-soon',
    failInit = 'fail-init',
    loggedOut = 'logged-out'
}

export interface IAppPageErrors {
    badRequest: IPageError;
    unauthorized: IPageError;
    forbidden: IPageError;
    notFound: IPageError;
    methodNotSupported: IPageError;
    internalServerError: IPageError;
    loggedOut: IPageError;
    failInit: IPageError;
    comingSoon: IPageError;
}

export interface IPageError {
    code: ErrorCodesEnum;
    title: string;
    titleKey?: string;
    text?: string;
    textKey?: string;
    displayActionsBtns?: boolean;
    displayErrorCode?: boolean;
}
