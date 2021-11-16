import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class CaseInsensitiveUrlSerializer extends DefaultUrlSerializer {
    private _ignored: string[] = [
        'implicit/callback',
        'request-logs',
        'dynamic-auth/profile'
    ];

    parse(url: string): UrlTree {
        if (this._ignored.some((s: string) => url.indexOf(s) !== -1)) {
            return super.parse(url);
        }

        const questionMarkIndex = url.indexOf('?');
        if (questionMarkIndex === -1) { return super.parse(url.toLowerCase()); }

        const pureUrl = url.substring(0, questionMarkIndex);
        const queryStr = url.substring(questionMarkIndex);

        return super.parse(`${pureUrl.toLowerCase()}${queryStr}`);
    }
}
