export enum MobileOsEnum {
    windowsPhone = 'Windows Phone',
    android = 'Android',
    ios = 'iOS',
    unknown = 'unknown'
}

export enum OsEnums {
    mac = 'MacOS',
    ios = 'iOS',
    windows = 'Windows',
    android = 'Android',
    linux = 'Linux'
}

export class UtilsFunctions {
    static findParentElementByClass(element: HTMLElement, cls: string): HTMLElement {
        let elemTmp = element;
        while (elemTmp.parentElement) {
            elemTmp = elemTmp.parentElement;
            if (elemTmp.className && elemTmp.className.indexOf(cls) !== -1) {
                break;
            }
        }
        return elemTmp;
    }

    static findChildElementByClassName(elm: Element, cls: string): Element {
        if (!elm) {
            return null;
        }
        if (elm.className.indexOf(cls) !== -1) {
            return elm;
        }
        if (elm.children.length === 0) {
            return null;
        }
        let result: Element = null;
        const coll = elm.children;
        for (let i = 0; i < coll.length; i++) {
            const tmpRes = this.findChildElementByClassName(coll.item(i), cls);
            if (tmpRes !== null) {
                result = tmpRes;
                break;
            }
        }
        return result;
    }

    static string_allIndexOf(source: string, searchVal: string): number[] {
        let i = -1;
        const indexes: number[] = [];
        // tslint:disable-next-line: no-conditional-assignment
        while ((i = source.indexOf(searchVal, i + 1)) !== -1) {
            indexes.push(i);
        }
        return indexes;
    }

    static getRandomInt(min: number, max: number) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    static getRandomStr(min: number, max: number, capital: boolean = false) {
        const vowels = [97, 101, 105, 111, 117];
        const vowelsUpper = [65, 69, 73, 79, 85];
        let length = UtilsFunctions.getRandomInt(min, max) - 1;
        let res = String.fromCharCode(
            capital
                ? (
                    length % 2 === 0
                        ? vowelsUpper[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(65, 90)
                )
                : (
                    length % 2 === 0
                        ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(97, 122)
                )
        );

        while (length-- >= 0) {
            res += String.fromCharCode(
                length % 2 === 0
                    ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                    : UtilsFunctions.getRandomInt(97, 122)
            );
        }
        return res;
    }

    static padNumber(value: number): string {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        } else {
            return '';
        }
    }

    static isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    static toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    static isMobileOrTabletDevice() {
        let check = false;
        ((userAgent) => {
            // tslint:disable-next-line:max-line-length
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || (window as any).opera);
        return check;
    }

    static iOS() {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        return /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream ||
            !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
    }

    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns MobileOsEnum
     */
    static getMobileOperatingSystem(): MobileOsEnum {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
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

    static getOS(): OsEnums {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        if (macosPlatforms.indexOf(platform) !== -1) {
            return OsEnums.mac;
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            return OsEnums.ios;
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            return OsEnums.windows;
        } else if (/Android/.test(userAgent)) {
            return OsEnums.android;
        } else if (/Linux/.test(platform)) {
            return OsEnums.linux;
        }

        return null;
    }

    static dateParse(key: string, value: any): any {
        const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        if (typeof value === 'string') {
            let matched = reISO.exec(value);
            if (matched) {
                return new Date(value);
            }
            matched = reMsAjax.exec(value);
            if (matched) {
                const datesVal = matched[1].split(/[-+,.]/);
                return new Date(datesVal[0] ? +datesVal[0] : 0 - +datesVal[1]);
            }
        }
        return value;
    }

    /**
     * Gets element top lef coords
     * crossbrowser version
     * @param elem HtmlElement
     * @returns element top lef coords
     */
    static getElementTopLefCoords(elem: HTMLElement): {
        top: number;
        left: number;
    } {
        const box = elem.getBoundingClientRect();
        const body = document.body;
        const docEl = document.documentElement;
        const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        const clientTop = docEl.clientTop || body.clientTop || 0;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;
        const top = box.top + scrollTop - clientTop;
        const left = box.left + scrollLeft - clientLeft;
        return {
            top: Math.round(top),
            left: Math.round(left)
        };
    }

    static getElementLefCoord(elem: HTMLElement): number {
        const box = elem.getBoundingClientRect();
        const body = document.body;
        const docEl = document.documentElement;
        const scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
        const clientLeft = docEl.clientLeft || body.clientLeft || 0;
        return box.left + scrollLeft - clientLeft;
    }

    static getElementTopFromScrollTop(elem: HTMLElement, scrollTop: number): number {
        const box = elem.getBoundingClientRect();
        return box.top + scrollTop;
    }

    /**
     * Gets element top lef coords from MatSidenavContent
     * @param elem HtmlElement
     * @param container MatSidenavContent
     * @returns element top lef coords
     */
    static getElementTopCoordsWithinMatSidenavContent(elem: HTMLElement, container: {
        measureScrollOffset(from: 'top'): number;
    }): number {
        const box = elem.getBoundingClientRect();
        const scrollTop = container.measureScrollOffset('top');
        const top = box.top + scrollTop;
        return top;
    }

    static getCurrentScroll(element: HTMLElement = null): {
        top: number;
        left: number;
        bottom: number;
    } {
        const body = document.body;
        const docEl = document.documentElement;
        return {
            top: window.pageYOffset || docEl.scrollTop || body.scrollTop,
            left: window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
            bottom: (element ? element.offsetHeight : body.clientHeight) - window.innerHeight - docEl.scrollTop,
        };
    }

    static isString(item: any) {
        return typeof (item) === 'string' || item instanceof String === true;
    }

    static isObjectEmpty(obj: any) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return false;
            }
        }
        return true;
    }

    static getPropIgnoringCase<T>(
        object: { [key: string]: T; }, key: string
    ): T {
        return object[Object.keys(object).find(k => k.toUpperCase() === key.toUpperCase())];
    }

    /**
     * Clones object
     * copied from https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
     * @returns clone object
     */
    static clone<TEntityType extends Date | Array<any> | object | any>(obj: TEntityType): TEntityType {
        let copy: TEntityType;
        // Handle the 3 simple types, and null or undefined
        if (null == obj || 'object' !== typeof obj) {
            return obj;
        }
        // Handle Date
        if ((obj as any) instanceof Date) {
            copy = new Date() as any;
            copy.setTime(obj.getTime());
            return copy;
        }
        // Handle Array
        if ((obj as any) instanceof Array) {
            copy = [] as any;
            for (let i = 0, length = obj.length; i < length; i++) {
                copy[i] = UtilsFunctions.clone(obj[i]);
            }
            return copy;
        }
        // Handle Object
        if ((obj as any) instanceof Object) {
            copy = {} as any;
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copy[key] = UtilsFunctions.clone(obj[key]);
                }
            }
            return copy;
        }
        throw new Error('Unable to copy obj! Its type isn\'t supported.');
    }

    static getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    static centerText(totalLegth: number, text: string, char: string = ' '): string {
        const left = Math.round((totalLegth - text.length) / 2);
        const right = (totalLegth - text.length) % 2 === 0 ? left : left - 1;
        return char.repeat(left) + text + char.repeat(right);
    }

    static padText(totalLength: number, orientation: 'left' | 'right', text: string, char: string = ' ') {
        return text.length >= totalLength
            ? text
            : orientation === 'left'
                ? char.repeat(totalLength - text.length) + text
                : text + char.repeat(totalLength - text.length);
    }

    static triggerLoadEvent(doc: Document): void {
        const evt = doc.createEvent('Event');
        evt.initEvent('load', false, false);
        window.dispatchEvent(evt);
    }

    /**
     * Marks all controls in a form group as touched
     * @param formGroup - The group to mark
     */
    static markFormGroupTouched(formGroup: FormGroup) {
        if (formGroup && formGroup.controls) {
            Object.keys(formGroup.controls).forEach((key: string) => {
                const control: any = formGroup.get(key);
                control.markAsTouched();

                if (control.controls) {
                    control.controls.forEach(c => this.markFormGroupTouched(c));
                }
            });
        }
    }

    static scrollToInvalidFormField(doc: Document, cls: string = 'is-invalid') {
        of(null).pipe(delay(0)).subscribe(() => {
            const invalidControls = doc.getElementsByClassName(cls);
            if (invalidControls.length >= 1) {
                const elm = invalidControls.item(0);
                elm.scrollIntoView({ block: 'start', inline: 'center', behavior: 'smooth' });
            }
        });
    }

    static hasErrorControl(formControl: FormControl): boolean {
        return formControl.touched && !formControl.invalid;
    }

    static findParentElementByClass(element: HTMLElement, cls: string): HTMLElement {
        let elemTmp = element;
        while (elemTmp.parentElement) {
            elemTmp = elemTmp.parentElement;
            if (elemTmp.className && elemTmp.className.indexOf(cls) !== -1) {
                break;
            }
        }
        return elemTmp;
    }

    static findChieldElementByClassName(elm: Element, cls: string): Element {
        if (!elm) {
            return null;
        }
        if (elm.className.indexOf(cls) !== -1) {
            return elm;
        }

        if (elm.children.length === 0) {
            return null;
        }

        let result: Element = null;
        const coll = elm.children;
        for (let i = 0, length = coll.length; i < length; i++) {
            const tmpRes = this.findChieldElementByClassName(coll[i], cls);
            if (tmpRes !== null) {
                result = tmpRes;
                break;
            }
        }

        return result;
    }

    static string_allIndexOf(source: string, searchVal: string): number[] {
        let i = -1;
        const indexes: number[] = [];
        while ((i = source.indexOf(searchVal, i === -1 ? 0 : (i + searchVal.length))) !== -1) {
            indexes.push(i);
        }
        return indexes;
    }

    static string_replaceAll(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

    static getRandomInt(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    static getDateFromNgbDateStruct(date: NgbDateStruct): Date {
        if (!date) { return new Date(); }
        return new Date(date.year, date.month - 1, date.day);
    }

    static padNumber(value: number): string {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        } else {
            return '';
        }
    }

    static isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    static toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    static isMobileOrTabletDevice() {
        let check = false;
        ((userAgent) => {
            // tslint:disable-next-line:max-line-length
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || (window as any).opera);
        return check;
    }

    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     */
    static getMobileOperatingSystem(): string {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/windows phone/i.test(userAgent)) {
            return 'Windows Phone';
        }

        if (/android/i.test(userAgent)) {
            return 'Android';
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return 'iOS';
        }

        return 'unknown';
    }

    static fireInputEventOnInputElement(
        componentRef: ElementRef, cls: string, skipIndex: number = null, fireSkipIndexAtEnd: boolean = false, timeout = 0
    ) {
        setTimeout(() => {
            let event;
            if (typeof (Event) === 'function') {
                event = new Event('input');
            } else {
                event = document.createEvent('Event');
                event.initEvent('input', false, true);
            }

            const items: NodeListOf<HTMLInputElement> = componentRef.nativeElement.querySelectorAll('input' + cls);

            for (let i = 0; i < items.length; ++i) {
                if (skipIndex != null && i === skipIndex) {
                    continue;
                }

                const elm = items.item(i);
                if (elm.value) {
                    elm.dispatchEvent(event);
                }
            }

            if (skipIndex && skipIndex <= items.length && fireSkipIndexAtEnd === true) {
                items.item(skipIndex).dispatchEvent(event);
            }
        }, timeout);
    }

    static dateParse(key: string, value: any): any {
        const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        if (typeof value === 'string') {
            let matched = reISO.exec(value);
            if (matched) {
                return new Date(value);
            }
            matched = reMsAjax.exec(value);
            if (matched) {
                const datesVal = matched[1].split(/[-+,.]/);
                return new Date(datesVal[0] ? +datesVal[0] : 0 - +datesVal[1]);
            }
        }
        return value;
    }

    static getRandomStr(min: number, max: number, capital: boolean = false, withNumbers = false) {
        const vowels = [97, 101, 105, 111, 117];
        const vowelsUpper = [65, 69, 73, 79, 85];
        let length = UtilsFunctions.getRandomInt(min, max) - 1;
        let res = String.fromCharCode(
            capital
                ? (
                    length % 2 === 0
                        ? vowelsUpper[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(65, 90)
                )
                : (
                    length % 2 === 0
                        ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(97, 122)
                )
        );

        while (length-- >= 0) {
            res += withNumbers && UtilsFunctions.getRandomInt(0, 100) % 3 === 0
                ? UtilsFunctions.getRandomInt(0, 9)
                : String.fromCharCode(
                    length % 2 === 0
                        ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(97, 122)
                );
        }
        return res;
    }

    static getMomentDateFormatted(asString: boolean, mDate: Moment.Moment): string | NgbDateStruct {
        if (!asString) {
            return {
                year: mDate.year(),
                month: mDate.month() + 1,
                day: mDate.date()
            };
        }
        return mDate.format('MM/DD/YYYY');
    }

    static getNgbDateFromMomentDate(mDate: Moment.Moment): NgbDateStruct {
        return {
            year: mDate.year(),
            month: mDate.month() + 1,
            day: mDate.date()
        };
    }

    static getDateStrFromNgbDate(ngbDate: NgbDateStruct): string {
        return `${ngbDate.year}-${ngbDate.month}-${ngbDate.day}`;
    }

    static minToSec(min: number) {
        return min * 60 * 1000;
    }

    /**
     * Marks all controls in a form group as touched
     * @param formGroup - The group to caress..hah
     */
    static markFormGroupTouched(formGroup: FormGroup) {
        if (formGroup && formGroup.controls) {
            Object.keys(formGroup.controls).forEach((key: string) => {
                const control: any = formGroup.get(key);
                control.markAsTouched();

                if (control.controls) {
                    control.controls.forEach(c => this.markFormGroupTouched(c));
                }
            });
        }
    }

    static getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    static scrollToInvalidFormField(doc: Document, cls: string = 'is-invalid') {
        of(null).pipe(delay(0)).subscribe(() => {
            const invalidControls = doc.getElementsByClassName(cls);
            if (invalidControls.length >= 1) {
                const elm = invalidControls.item(0);
                elm.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    static hasErrorControl(formControl: FormControl): boolean {
        return formControl.touched && !formControl.invalid;
    }

    static findParentElementByClass(element: HTMLElement, cls: string): HTMLElement {
        let elemTmp = element;
        while (elemTmp.parentElement) {
            elemTmp = elemTmp.parentElement;
            if (elemTmp.className && elemTmp.className.indexOf(cls) !== -1) {
                break;
            }
        }
        return elemTmp;
    }

    static findChieldElementByClassName(elm: Element, cls: string): Element {
        if (!elm) {
            return null;
        }
        if (elm.className.indexOf(cls) !== -1) {
            return elm;
        }

        if (elm.children.length === 0) {
            return null;
        }

        let result: Element = null;
        const coll = elm.children;
        for (let i = 0; i < coll.length; i++) {
            const tmpRes = this.findChieldElementByClassName(coll[i], cls);
            if (tmpRes !== null) {
                result = tmpRes;
                break;
            }
        }

        return result;
    }

    static string_allIndexOf(source: string, searchVal: string): number[] {
        let i = -1;
        const indexes: number[] = [];
        while ((i = source.indexOf(searchVal, i + 1)) !== -1) {
            indexes.push(i);
        }
        return indexes;
    }

    static string_replaceAll(target, search, replacement) {
        return target.replace(new RegExp(search, 'g'), replacement);
    }

    static getRandomInt(min, max) {
        return min + Math.floor(Math.random() * (max - min + 1));
    }

    static getDateFromNgbDateStruct(date: NgbDateStruct): Date {
        if (!date) { return new Date(); }
        return new Date(date.year, date.month - 1, date.day);
    }

    static padNumber(value: number): string {
        if (this.isNumber(value)) {
            return `0${value}`.slice(-2);
        } else {
            return '';
        }
    }

    static isNumber(value: any): boolean {
        return !isNaN(this.toInteger(value));
    }

    static toInteger(value: any): number {
        return parseInt(`${value}`, 10);
    }

    static isMobileOrTabletDevice() {
        let check = false;
        (function (userAgent) {
            // tslint:disable-next-line:max-line-length
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4))) {
                check = true;
            }
        })(navigator.userAgent || navigator.vendor || (<any>window).opera);
        return check;
    }

    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {String}
     */
    static getMobileOperatingSystem() {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

        if (/windows phone/i.test(userAgent)) {
            return 'Windows Phone';
        }

        if (/android/i.test(userAgent)) {
            return 'Android';
        }

        if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
            return 'iOS';
        }

        return 'unknown';
    }

    static minToSec(min: number) {
        return min * 60 * 1000;
    }

    static getRandomStr(min: number, max: number, capital: boolean = false) {
        const vowels = [97, 101, 105, 111, 117];
        const vowelsUpper = [65, 69, 73, 79, 85];
        let length = UtilsFunctions.getRandomInt(min, max) - 1;
        let res = String.fromCharCode(
            capital
                ? (
                    length % 2 === 0
                        ? vowelsUpper[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(65, 90)
                )
                : (
                    length % 2 === 0
                        ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                        : UtilsFunctions.getRandomInt(97, 122)
                )
        );

        while (length-- >= 0) {
            res += String.fromCharCode(
                length % 2 === 0
                    ? vowels[UtilsFunctions.getRandomInt(0, 4)]
                    : UtilsFunctions.getRandomInt(97, 122)
            );
        }
        return res;
    }
    
    static getMomentDateFormatted(asString: boolean, mDate: Moment.Moment): string | NgbDateStruct {
        if (!asString) {
            return {
                year: mDate.year(),
                month: mDate.month() + 1,
                day: mDate.date()
            };
        }
        return mDate.format('YYYY-MM-DD');
    }

    static getNgbDateFromMomentDate(mDate: Moment.Moment): NgbDateStruct {
        return {
            year: mDate.year(),
            month: mDate.month() + 1,
            day: mDate.date()
        };
    }

    static getDateStrFromNgbDate(ngbDate: NgbDateStruct): string {
        return `${ngbDate.year}-${ngbDate.month}-${ngbDate.day}`;
    }

    static minToSec(min: number) {
        return min * 60 * 1000;
    }

    dispatchEvent(
    //     document: Document,
    //     element: HTMLElement | Document | Window,
    //     eventName: string,
    //     bubbles = true,
    //     cancellable = true
    // ): void {
    //     let event: Event;
    //     if (typeof (Event) === 'function') {
    //         event = new Event(eventName);
    //     } else {
    //         event = document.createEvent('Event');
    //         event.initEvent(eventName, bubbles, cancellable);
    //     }
    //     element.dispatchEvent(event);
    // }
}
