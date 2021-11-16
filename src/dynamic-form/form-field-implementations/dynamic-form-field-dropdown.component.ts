import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DropdownField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-dropdown',
    templateUrl: './dynamic-form-field-dropdown.component.html'
})
export class DynamicFormFieldDropDownComponent {
    @Input() field!: DropdownField<any>;
    @Input() control!: FormControl;
}
