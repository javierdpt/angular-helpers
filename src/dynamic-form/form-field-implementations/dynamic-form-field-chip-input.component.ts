import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { slideInOutAnimation } from '../dynamic-form-animations.const';
import { ChipInputField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-chip-input',
    templateUrl: './dynamic-form-field-chip-input.component.html',
    animations: [slideInOutAnimation]
})
export class DynamicFormFieldChipInputComponent {
    @Input() field!: ChipInputField;
    @Input() control!: FormControl;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    add(event: MatChipInputEvent): void {
        const controlValue = this.control.value?.length
            ? this.control.value : [];
        if ((event.value || '').trim()) {
            controlValue.push(event.value.trim());
            this.control.setValue(controlValue);
        }

        if (event.input) {
            event.input.value = '';
        }
    }

    remove(i: number): void {
        const controlValue: string[] = this.control.value;
        controlValue.splice(i, 1);
        this.control.setValue(controlValue);
    }

    hasError(): boolean {
        return this.control.touched && !!this.control.errors;
    }
}
