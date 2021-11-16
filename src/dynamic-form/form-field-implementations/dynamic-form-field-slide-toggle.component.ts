import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SlideToggleField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-slide-toggle',
    templateUrl: './dynamic-form-field-slide-toggle.component.html',
    styles: [`.field-container { padding: 0.9375rem; }`]
})
export class DynamicFormFieldSlideToggleComponent {
    @Input() field!: SlideToggleField;
    @Input() control!: FormControl;
}
