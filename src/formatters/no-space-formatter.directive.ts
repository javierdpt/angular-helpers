import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

import { BaseFormatterDirectiveDefinition, InputValues } from './base-formatter-directive.model';

@Directive({
    selector: '[appNoSpaceFormatter]'
})
export class NoSpaceFormatterDirective extends BaseFormatterDirectiveDefinition implements OnInit {
    constructor(elementRef: ElementRef, control: NgControl) {
        super(elementRef, control);
     }

     protected processInputValues(): InputValues {
        const baseInputValues = super.processInputValues();
        const val = baseInputValues.model.replace(' ', '');

        return {
            model: val,
            view: val
        };
    }
}
