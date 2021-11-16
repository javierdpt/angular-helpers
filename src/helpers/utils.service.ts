import { TitleCasePipe } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { IMitigatingAction } from '../models/mitigation-action.model';
import { EnumType } from '../models/shared.model';
import { StartlizePipe } from '../shared/pipes/start-case.pipe';
import { WINDOW } from './injection-token.service';
import { MobileOsEnum, OsEnums } from './utils.model';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {
    constructor(@Inject(WINDOW) private readonly _windowRef: Window) {

    }

    /**
     * Gets random int between min and max included.
     *
     * @param min minium number included
     * @param max maximum number included
     * @returns random int
     */
    getRandomInt(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    getRandomStr(min: number, max: number, capital: boolean = false, withNumbers = false): string {
        const vowels = [97, 101, 105, 111, 117];
        const getRandomChar = (upper: boolean = false): string => {
            const char = String.fromCharCode(
                this.getRandomInt(1, 12) % 3 === 0
                    ? this.getRandomInt(97, 122)
                    : vowels[this.getRandomInt(0, 4)]
            );

            return !upper ? char : char.toUpperCase();
        };

        let length = this.getRandomInt(min, max) - 1;
        let res = getRandomChar(capital);

        while (length-- > 0) {
            res += withNumbers && this.getRandomInt(0, 100) % 3 === 0
                ? this.getRandomInt(0, 9)
                : getRandomChar();
        }

        return res;
    }

    getRandomWords(wordsCount: number, min: number, max: number, firstCapital: boolean = false): string {
        const words: string[] = [];
        for (let i = 0; i < wordsCount; i++) {
            words.push(this.getRandomStr(min, max, i === 0 && firstCapital));
        }
        return words.join(' ');
    }

    padNumber(value: number): string {
        return this.isNumber(value)
            ? `0${value}`.slice(-2)
            : '';
    }

    isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    isMobileOrTabletDevice(): boolean {
        let check = false;
        ((userAgent): void => {
            // eslint-disable-next-line max-len
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
                check = true;
            }
        })(
            this._windowRef.navigator.userAgent ??
            this._windowRef.navigator.vendor ??
            (this._windowRef as any).opera
        );
        return check;
    }

    getOS(): OsEnums | null {
        const userAgent = this._windowRef.navigator.userAgent;
        const platform = this._windowRef.navigator.platform;

        if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(platform) !== -1) {
            return OsEnums.mac;
        } else if (
            ['iPhone', 'iPad', 'iPod'].indexOf(userAgent) !== -1 ||
            ['iPhone', 'iPad', 'iPod'].some(v => userAgent.indexOf(v) !== -1)
        ) {
            return OsEnums.ios;
        } else if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1) {
            return OsEnums.windows;
        } else if (/Android/.test(userAgent)) {
            return OsEnums.android;
        } else if (/Linux/.test(platform)) {
            return OsEnums.linux;
        }

        return null;
    }

    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns MobileOsEnum
     */
    getMobileOperatingSystem(): MobileOsEnum {
        const userAgent = this._windowRef.navigator.userAgent ||
            this._windowRef.navigator.vendor ||
            (this._windowRef as any).opera;
        if (/windows phone/i.test(userAgent)) {
            return MobileOsEnum.windowsPhone;
        }
        if (/android/i.test(userAgent)) {
            return MobileOsEnum.android;
        }
        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return MobileOsEnum.ios;
        }
        return MobileOsEnum.unknown;
    }

    getUrlParameter(name: string): string | '' {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(this._windowRef.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    getEntitySearchTerm<T extends { [key: string]: any }>(entity: T, fields: (keyof T)[]): string {
        return fields.map((field: keyof T) => entity[field])
            .filter(r => !!r).join('◬').toLowerCase();
    }

    getFilteredEntityOptions<T>(
        until$: Observable<void>,
        entities: T[],
        control: FormControl,
        searchFields: (keyof T)[]
    ): Observable<T[]> {
        return control.valueChanges
            .pipe(
                startWith(null),
                map((value: null | string | T) => {
                    const filterValue = typeof value === 'string' ? value.toLowerCase() : null;
                    return filterValue
                        ? entities.filter((e: T) =>
                            this.getEntitySearchTerm(e, searchFields).includes(filterValue))
                        : entities;
                }),
                takeUntil(until$)
            );
    }

    centerText(totalLength: number, text: string, char: string = ' '): string {
        const left = Math.round((totalLength - text.length) / 2);
        const right = (totalLength - text.length) % 2 === 0 ? left : left - 1;
        return char.repeat(left) + text + char.repeat(right);
    }

    padText(totalLength: number, orientation: 'left' | 'right', text: string, char: string = ' '): string {
        return text.length >= totalLength
            ? text
            : orientation === 'left'
                ? char.repeat(totalLength - text.length) + text
                : text + char.repeat(totalLength - text.length);
    }

    getRandomItemFromArray<T>(items: T[]): T | null {
        if (!items.length) { return null; }
        return items[this.getRandomInt(0, items.length - 1)];
    }

    getRandomArray(minLength: number, maxLength: number): number[] {
        return [...new Array(this.getRandomInt(minLength, maxLength)).keys()];
    }

    getRandomArrayTransformed<T>(minLength: number, maxLength: number, mapper: (index: number) => T): T[] {
        return this.getRandomArray(minLength, maxLength).map((_v, i) => mapper(i));
    }

    getObjectKeyValuePairs(options: {
        input: { [key: string]: any };
        ignoredProps?: string[];
        order?: string[];
        transform?: (key: string, value: any) => string;
    }): { title: string; value: string }[] {
        const items: { title: string; value: string }[] = [];

        const addItem = (key: string, arr: { title: string; value: string }[]): void => {
            arr.push({
                title: key,
                value: !options.transform ? options.input[key] : options.transform(key, options.input[key])
            });
        };

        const unOrderedItems: { title: string; value: string }[] = [];
        for (const key in options.input) {
            if (Object.prototype.hasOwnProperty.call(options.input, key) &&
                (!options.ignoredProps || !options.ignoredProps.some(ip => ip === key))
            ) {
                addItem(key, !options.order || options.order.some(k => k === key) ? items : unOrderedItems);
            }
        }

        return !options.order
            ? items
            : items
                .sort((a, b) => options.order!.indexOf(a.title) - options.order!.indexOf(b.title))
                .concat(unOrderedItems);
    }

    getMitigatingActionText(ma: IMitigatingAction | null | undefined): string {
        if (!ma) { return ''; }

        const slp = new StartlizePipe();
        const tcp = new TitleCasePipe();
        return this.getMitigatingActionDynamicKeyValues(ma)
            .map(v =>
                `<span class="d-block strong">${tcp.transform(slp.transform(v.key))}:` +
                ` <span class="badge bg-secondary">${v.value}</span></span>`)
            .join('');
    }

    getMitigatingActionDynamicKeyValues(ma: IMitigatingAction | null | undefined): { key: string; value: string }[] {
        if (!ma) { return []; }

        return Object.keys(ma)
            .filter(k => ['id', 'mitigatingActionType', 'causalDescription', 'documentType', 'partitionKey', '_ts', 'metadata']
                .every(ignoredKey => k !== ignoredKey)
            )
            .reduce((res, k) => {
                res.push({ key: k, value: ma[k] });
                return res;
            }, [] as { key: string; value: string }[]);
    }

    getEnumValues<T extends string | number>(e: EnumType<T>): T[] {
        return Object.keys(e)
            .map((v: string) => (e as unknown as { [key: string]: T })[v]);
    }
}
