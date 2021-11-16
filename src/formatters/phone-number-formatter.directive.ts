import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { UtilsService } from '../../core/utils.service';
import { BaseFormatterDirectiveDefinition, InputValues } from './base-formatter-directive.model';

@Directive({
    selector: '[appPhoneNumberFormatter]'
})
export class PhoneNumberFormatterDirective extends BaseFormatterDirectiveDefinition implements OnInit {
    @Input() appPhoneNumberFormatter: number | string;
    isAndroid: boolean;
    prevValue: string;

    constructor(elementRef: ElementRef, control: NgControl, private _utils: UtilsService) {
        super(elementRef, control);
    }

    ngOnInit(): void {
        super.ngOnInit();

        this.appPhoneNumberFormatter = this.appPhoneNumberFormatter
            ? this.appPhoneNumberFormatter
            : 10;
        this.isAndroid = this._utils.getMobileOperatingSystem() === 'Android';
    }

    @HostListener('input', ['$event']) onEvent() {
        const inputValues = this.processInputValues();

        const lengthBaseCursor = this._lengthBaseOnCursorPosition(this._inputElement.selectionStart);

        this.control.control.setValue(inputValues.model);
        this._inputElement.value = inputValues.view;

        const pos = lengthBaseCursor < inputValues.model.length
            ? this._cursorPositionBaseOnLength(lengthBaseCursor)
            : this._cursorPositionBaseOnLength(inputValues.model.length);

        if (this.isAndroid) {
            // Fix for Android devices
            if (this.prevValue === inputValues.model) {
                return;
            } else {
                this.prevValue = inputValues.model;
            }
            setTimeout(() => {
                this._inputElement.setSelectionRange(pos, pos);
            }, 0);
        } else {
            this._inputElement.setSelectionRange(pos, pos);
        }
    }

    protected processInputValues(): InputValues {
        const baseInputValues = super.processInputValues();
        const modelVal = this._numbersOnly(baseInputValues.model).substr(0, +this.appPhoneNumberFormatter);
        const viewVal = this._formatPhone(modelVal);

        return {
            model: modelVal,
            view: viewVal
        };
    }

    private _numbersOnly(input: string): string {
        return input.replace(/[^\d]/g, '');
    }

    private _formatPhone(phone: any): string {
        let phoneDig = this._numbersOnly('' + phone);
        const length = phoneDig.length;
        for (let i = 0; i < 10 - length; ++i) {
            phoneDig += 'z';
        }
        return phoneDig.replace(new RegExp('(\\w{3})(\\w{3})(\\w{4})'), '($1) $2-$3').replace(new RegExp('z', 'g'), ' ');
    }

    private _cursorPositionBaseOnLength(length: number) {
        switch (length) {
            case 1:
                return 2;
            case 2:
                return 3;
            case 3:
                return 4;
            case 4:
                return 7;
            case 5:
                return 8;
            case 6:
                return 9;
            case 7:
                return 11;
            case 8:
                return 12;
            case 9:
                return 13;
            case 10:
                return 14;
        }
        return 0;
    }

    private _lengthBaseOnCursorPosition(cursorPos: number): number {
        switch (cursorPos) {
            case 0:
                return 1;
            case 1:
                return 1;
            case 2:
                return 1;
            case 3:
                return 2;
            case 4:
                return 3;
            case 5:
                return 4;
            case 6:
                return 4;
            case 7:
                return 4;
            case 8:
                return 5;
            case 9:
                return 6;
            case 10:
                return 7;
            case 11:
                return 7;
            case 12:
                return 8;
            case 13:
                return 9;
            case 14:
                return 10;
        }
        return 10;
    }
}
