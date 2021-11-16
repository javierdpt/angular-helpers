import { Component, HostBinding, Input } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import {
    ArrayField,
    AutoCompleteField,
    ChipAutoCompleteField,
    ChipInputField,
    ControlType,
    DatePickerField,
    DropdownField,
    FormFieldBase,
    GroupField,
    InputField,
    SlideToggleField,
    TextAreaField
} from './dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field',
    templateUrl: './dynamic-form-field.component.html',
    styleUrls: ['./dynamic-form-field.component.scss']
})
export class DynamicFormFieldComponent {
    @Input() field!: FormFieldBase<any>;
    @Input() form!: FormGroup;
    @Input() fieldControl?: AbstractControl;
    @Input() class = '';

    controlTypeEnum = ControlType;

    @HostBinding('class') get hostClasses(): string {
        return [
            this.class,
            'dynamic-form-field',
            this.field.classes.join(' ')
        ].join(' ');
    }

    get formControl(): FormControl {
        return (this.fieldControl as FormControl) ?? this.form.get(this.field.key) as FormControl;
    }
    get formGroup(): FormGroup {
        return (this.fieldControl as FormGroup) ?? this.form.get(this.field.key) as FormGroup;
    }
    get formArray(): FormArray {
        return this.form.get(this.field.key) as FormArray;
    }

    get inputField(): InputField { return this.field as InputField; }
    get datePickerField(): DatePickerField { return this.field as DatePickerField; }
    get dropDownField(): DropdownField<any> { return this.field as DropdownField<any>; }
    get autoCompleteField(): AutoCompleteField<any> { return this.field as AutoCompleteField<any>; }
    get textAreaField(): TextAreaField { return this.field as TextAreaField; }
    get groupField(): GroupField { return this.field as GroupField; }
    get chipInputField(): ChipInputField { return this.field as ChipInputField; }
    get chipAutoCompleteField(): ChipAutoCompleteField<any> { return this.field as ChipAutoCompleteField<any>; }
    get slideToggleCompleteField(): SlideToggleField { return this.field as SlideToggleField; }
    get arrayField(): ArrayField<any> { return this.field as ArrayField<any>; }

}
