import { OnInit, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

export abstract class BaseFormatterDirectiveDefinition implements OnInit {
    protected _inputElement: HTMLInputElement;

    constructor(protected _elementRef: ElementRef, protected control: NgControl) { }

    ngOnInit(): void {
        this._inputElement = this.getInputElementRef();
    }

    @HostListener('input', ['$event']) onEvent() {
        const inputValues = this.processInputValues();

        const start = this._inputElement.selectionStart;
        const end = this._inputElement.selectionEnd;

        this.control.control.setValue(inputValues.model);
        this._inputElement.value = inputValues.view;

        this._inputElement.setSelectionRange(start, end);
    }

    protected processInputValues(): InputValues {
        return {
            model: this._inputElement.value,
            view: this._inputElement.value
        };
    }

    protected getInputElementRef(): HTMLInputElement {
        let input: HTMLInputElement;
        if (this._elementRef.nativeElement.tagName === 'INPUT') {
            input = this._elementRef.nativeElement;
        } else {
            input = this._elementRef.nativeElement.getElementsByTagName('INPUT')[0];
        }

        if (!input) {
            throw new Error('You can applied the \'titleCaseFormatter\' directive only on inputs or elements containing inputs');
        }

        return input;
    }
}

export class InputValues {
    model: string;
    view: string;
}
