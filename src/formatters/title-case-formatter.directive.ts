import { Directive, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

import { BaseFormatterDirectiveDefinition, InputValues } from './base-formatter-directive.model';

@Directive({
    selector: '[appTitleCaseFormatter]'
})
export class TitleCaseFormatterDirective extends BaseFormatterDirectiveDefinition {
    constructor(elementRef: ElementRef, control: NgControl) {
        super(elementRef, control);
     }

     protected processInputValues(): InputValues {
        const baseInputValues = super.processInputValues();
        const val = this.toTitleCase(baseInputValues.model);

        return {
            model: val,
            view: val
        };
    }

    private toTitleCase(str: string): string {
        return this._trimLeft(str).replace(/\w\S*/g, (txt: string) => txt.charAt(0).toUpperCase() + txt.substr(1));
    }

    private _trimLeft(str: string) {
        if (str == null)  {
            return str;
        }
        return str.replace(/^\s+/g, '');
    }
}
