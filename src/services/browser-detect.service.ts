import { Inject, Injectable } from '@angular/core';
import { browserData, BrowsersEnum, IBrowserData } from './browser-detect.model';
import { WINDOW } from './injection-token.service';

@Injectable({
    providedIn: 'root'
})
export class BrowserDetectService {
    browser: BrowsersEnum | null;
    version: number;
    private _versionSearchString?: string;

    constructor(@Inject(WINDOW) private readonly _windowRef: Window) {
        this.browser = this._searchString(browserData);
        this.version = this._searchVersion(this._windowRef.navigator.userAgent) ??
            this._searchVersion(this._windowRef.navigator.appVersion) ?? -1;
    }

    protected _searchString(data: IBrowserData[]): BrowsersEnum | null {
        const userAgent = this._windowRef.navigator.userAgent;
        for (let i = 0, length = data.length; i < length; i++) {
            if (userAgent.indexOf(data[i].substr) !== -1) {
                this._versionSearchString = data[i].substr;
                return data[i].identity;
            }
        }

        return null;
    }

    protected _searchVersion(dataString: string): number | null {
        if (!this._versionSearchString) { return null; }

        const rv = dataString.indexOf('rv:');
        if (this._versionSearchString === 'Trident' && rv !== -1) {
            return parseFloat(dataString.substring(rv + 3));
        } else {
            const res = parseFloat(dataString.substring(dataString.indexOf(this._versionSearchString)
                + this._versionSearchString.length + 1));
            return !isNaN(res) ? res : null;
        }
    }
}
