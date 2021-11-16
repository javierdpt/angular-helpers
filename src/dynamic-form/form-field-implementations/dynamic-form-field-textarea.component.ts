import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { TextAreaField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-textarea',
    templateUrl: './dynamic-form-field-textarea.component.html'
})
export class DynamicFormFieldTextareaComponent {
    @Input() field!: TextAreaField;
    @Input() control!: FormControl;
}
