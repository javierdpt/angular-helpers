import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { ArrayField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-array',
    templateUrl: './dynamic-form-field-array.component.html'
})
export class DynamicFormFieldArrayComponent {
    @Input() field!: ArrayField<any>;
    @Input() control!: FormArray;
}
