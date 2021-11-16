/* eslint-disable max-len */

import { ErrorCodesEnum, IAppPageErrors } from './page-error.model';

export const pageErrors: IAppPageErrors = {
    badRequest: {
        code: ErrorCodesEnum.badRequest,
        title: 'Bad Request',
        titleKey: 'ErrorHand_Title_400',
        text: 'You\'ve encountered a 400 error, a bad request was sent to us.' +
            ' Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        textKey: 'ErrorHand_Text_400'
    },
    unauthorized: {
        code: ErrorCodesEnum.unauthorized,
        title: 'Unauthorized',
        titleKey: 'ErrorHand_Title_401',
        text: 'You\'ve encountered a 401 error, you don\'t have permission to access this resource.' +
            ' Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        textKey: 'ErrorHand_Text_401'
    },
    methodNotSupported: {
        code: ErrorCodesEnum.methodNotSupported,
        title: 'Not Supported',
        titleKey: 'ErrorHand_Title_405',
        text: 'You\'ve encountered a 405 error, this operation is not supported.' +
            ' Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        textKey: 'ErrorHand_Text_405'
    },
    forbidden: {
        code: ErrorCodesEnum.forbidden,
        title: 'Forbidden',
        titleKey: 'ErrorHand_Title_403',
        text: 'You’ve encountered a 403 error, you don’t have permission to access this resource.' +
            ' Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        textKey: 'ErrorHand_Text_403',
        displayActionsBtns: false
    },
    notFound: {
        code: ErrorCodesEnum.notFound,
        title: 'Not found',
        text: 'You\'ve encountered a 404 error, the resource you are looking for wasn\'t found. ' +
            'Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        titleKey: 'ErrorHand_Title_404',
        textKey: 'ErrorHand_Text_404'
    },
    internalServerError: {
        code: ErrorCodesEnum.internalServerError,
        title: 'Technical Error',
        titleKey: 'ErrorHand_Title_500',
        text: 'You’ve encountered a 500 error, something went wrong. Please try again or reach out the GRM Team for assistance at ' +
            '<a href="mailto:GRMSupport@assurant.com">GRMSupport@assurant.com</a>.',
        textKey: 'ErrorHand_Text_500'
    },
    failInit: {
        code: ErrorCodesEnum.failInit,
        title: 'Fail Init',
        titleKey: 'ErrorHand_Title_FailInit',
        text: 'Technical error. Our team is working to correct the issue. We apologize for the inconvenience.' +
            ' Please refresh and try again later.',
        textKey: 'ErrorHand_Text_FailInit'
    },
    comingSoon: {
        code: ErrorCodesEnum.comingSoon,
        title: '',
        text: '<img width="100%" src="https://media4.giphy.com/media/8FPCEmtFxzk3d6yPaZ/giphy.webp?cid=790b7611308b06d13ccfa854f346e90a640d9e84ddf84269&rid=giphy.webp&ct=g">'
    },
    loggedOut: {
        code: ErrorCodesEnum.loggedOut,
        title: 'Logged out',
        titleKey: 'ErrorHand_Title_LoggedOut',
        text: 'You\'re logged out. If you need to login click the "Login" button below.',
        textKey: 'ErrorHand_Text_LoggedOut',
        displayErrorCode: false
    }
};
