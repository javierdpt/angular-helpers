import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharerTypes } from './sharer.model';
import { SharerService } from './sharer.service';

@Injectable({
    providedIn: 'root'
})
export class ErrorUtilsService {

    constructor(private _router: Router, private _sharer: SharerService<any>) { }

    redirectError(code: string, errorMsg = ''): void {
        const cmds: any[] = [`/error/${code}`];
        if (errorMsg && errorMsg !== '') {
            this._sharer.add(errorMsg, SharerTypes.applicationTextError);
        }
        this._router.navigate(cmds);
    }

    redirectPageError(errorMsg = ''): void {
        this.redirectError('500', errorMsg);
    }

    redirectPageNotFound(errorMsg = ''): void {
        this.redirectError('404', errorMsg);
    }

    redirectUnauthorizedPage(errorMsg = ''): void {
        this.redirectError('401', errorMsg);
    }

    redirectForbiddenPage(errorMsg = ''): void {
        this.redirectError('403', errorMsg);
    }

    redirectGeneric(errorMsg: string): void {
        this.redirectError('generic', errorMsg);
    }
}
