import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GroupField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-group',
    templateUrl: './dynamic-form-field-group.component.html'
})
export class DynamicFormFieldGroupComponent {
    @Input() field!: GroupField;
    @Input() control!: FormGroup;
}
