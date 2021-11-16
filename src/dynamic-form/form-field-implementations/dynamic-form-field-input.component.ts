import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-input',
    templateUrl: './dynamic-form-field-input.component.html'
})
export class DynamicFormFieldInputComponent {
    @Input() field!: InputField;
    @Input() control!: FormControl;
}
