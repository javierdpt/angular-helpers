import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { BaseFormatterDirectiveDefinition, InputValues } from './base-formatter-directive.model';

@Directive({
    selector: '[appNumbersOnlyFormatter]'
})
export class NumbersOnlyFormatterDirective extends BaseFormatterDirectiveDefinition implements OnInit {

    constructor(elementRef: ElementRef, control: NgControl) {
        super(elementRef, control);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

    protected processInputValues(): InputValues {
        const baseInputValues = super.processInputValues();
        const val = this._numbersOnly(baseInputValues.model);

        return {
            model: val,
            view: val
        };
    }

    private _numbersOnly(input: string): string {
        return input.replace(/[^\d]/g, '');
    }
}
