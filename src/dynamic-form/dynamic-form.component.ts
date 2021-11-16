import { Component, HostBinding, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormFieldBase } from './dynamic-form.model';

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent {
    @Input() class = '';
    @Input() form!: FormGroup;

    formFieldsSorted!: FormFieldBase<any>[];

    private _formFields: FormFieldBase<any>[] = [];

    @HostBinding('class') get hostClasses(): string {
        return [
            this.class,
            'dynamic-form',
            'row m-0 p-0'
        ].join(' ');
    }

    get formFields(): FormFieldBase<any>[] {
        return this._formFields;
    }

    @Input() set formFields(value: FormFieldBase<any>[]) {
        this._formFields = value;
        this.formFieldsSorted = [...this.formFields]
            .sort((a: FormFieldBase<any>, b: FormFieldBase<any>) => a.order - b.order);
    }
}
