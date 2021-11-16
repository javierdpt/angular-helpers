import { EventEmitter } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { BootstrapBrakes, ClassesBootstrapBrakes } from '../../models/classes.model';
import { DynamicFormService } from './dynamic-form.service';

export enum ControlType {
    group, hidden, input, dropdown, autocomplete, datePicker, textarea,
    chipInput, chipAutocomplete, slideToggle, array
}

export interface IFormField<T> {
    value?: T;
    key: string;
    labelKey?: string;
    label?: string;
    disabled?: boolean;
    validators?: IFormFieldValidator[];
    asyncValidators?: IFormFieldAsyncValidator[];
    order: number;
    autocomplete: 'on' | 'off';
}

export abstract class FormFieldBase<T = any> extends ClassesBootstrapBrakes implements IFormField<T> {
    value?: T;
    key: string;
    labelKey?: string;
    label?: string;
    disabled?: boolean;
    styles?: Partial<CSSStyleDeclaration>;
    validators?: IFormFieldValidator[];
    asyncValidators?: IFormFieldAsyncValidator[];
    order: number;
    visible = true;
    refresh$?: EventEmitter<void>;
    autocomplete: 'on' | 'off';
    abstract controlType: ControlType;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: T;
        classes?: string[];
        styles?: Partial<CSSStyleDeclaration>;
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        autocomplete?: 'on' | 'off';
    }) {
        super(options.classes, options.brakes);
        this.key = options.key;
        this.label = options.label;
        this.labelKey = options.labelKey;
        this.disabled = options.disabled ?? false;
        this.styles = options.styles;
        this.value = options.value;
        this.validators = options.validators;
        this.asyncValidators = options.asyncValidators;
        this.order = options.order ?? 0;
        this.refresh$ = options.refresh$;
        if (options.visible !== undefined) {
            this.visible = options.visible === true;
        }
        this.autocomplete = options.autocomplete ?? 'on';
    }

    getControl(initialValue?: T | string | null): AbstractControl {
        const initVal = this.value ?? initialValue ?? '';
        const control = this.validators?.length
            ? new FormControl(initVal, this.validators.map((v: IFormFieldValidator) => v.validator))
            : new FormControl(initVal);

        if (this.disabled) {
            control.disable();
        }

        this.asyncValidators?.length && (control.setAsyncValidators(
            this.asyncValidators.map((v: IFormFieldAsyncValidator) => v.validator)
        ));

        return control;
    }
}

export class HiddenField<T> extends FormFieldBase<T> {
    controlType = ControlType.hidden;
}

export class InputField extends FormFieldBase<string | number> {
    controlType = ControlType.input;
    type: HtmlInputType;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: string | number;
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        type?: HtmlInputType;
        autocomplete?: 'on' | 'off';
    }) {
        super(options);
        this.type = options.type ?? 'text';
    }
}

export class TextAreaField extends FormFieldBase<string> {
    controlType = ControlType.textarea;
    rows: number;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: string;
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        rows?: number;
    }) {
        super(options);
        this.rows = options.rows ?? 1;
    }
}

export class DropdownField<T> extends FormFieldBase<T> {
    controlType = ControlType.dropdown;
    options: { labelKey?: string; label?: string; value: T }[];

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: T;
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        options?: { labelKey?: string; label?: string; value: T }[];
    }) {
        super(options);
        this.options = options.options ?? [];
    }
}

export class AutoCompleteField<T = any> extends DropdownField<T> {
    controlType = ControlType.autocomplete;
}

export class DatePickerField extends FormFieldBase<Date> {
    controlType = ControlType.datePicker;
    dateRestrictions?: DatePikerFieldDateRestriction;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: Date;
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        dateRestrictions?: DatePikerFieldDateRestriction;
    }) {
        super(options);
        this.dateRestrictions = options.dateRestrictions;
    }
}

export type DatePikerFieldDateRestriction = { min?: Date; max?: Date };

export class GroupField extends FormFieldBase<undefined> {
    controlType = ControlType.group;
    fields: FormFieldBase<any>[];

    constructor(
        options: {
            key: string;
            label?: string;
            labelKey?: string;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            disabled?: boolean;
            visible?: boolean;
            fields: FormFieldBase<any>[];
        },
        private readonly _dynamicForm: DynamicFormService
    ) {
        super(options);
        this.fields = options.fields;
    }

    getGroup(): FormGroup {
        const formGroup = this._dynamicForm.getFormGroup(this.fields);

        if (this.disabled) {
            formGroup.disable();
        }

        this.validators && formGroup.setValidators(this.validators.map((v: IFormFieldValidator) => v.validator));
        this.asyncValidators && formGroup.setAsyncValidators(this.asyncValidators.map((v: IFormFieldAsyncValidator) => v.validator));
        return formGroup;
    }
}

export class ChipInputField extends FormFieldBase<string[]> {
    placeholder?: string;
    placeholderKey?: string;
    controlType = ControlType.chipInput;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        placeholder?: string;
        placeholderKey?: string;
        disabled?: boolean;
        value?: string[];
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        type?: HtmlInputType;
    }) {
        super(options);
        this.placeholder = options.placeholder;
        this.placeholderKey = options.placeholderKey;
    }
}

export class ChipAutoCompleteField<T> extends FormFieldBase<T[]> {
    placeholder?: string;
    placeholderKey?: string;
    controlType = ControlType.chipAutocomplete;
    options: { labelKey?: string; label?: string; value: T }[];

    /**
     * Custom field to allow add values manually
     */
    inputable?: { nullValue?: string; nullValueKey?: string; emptyValue?: string; emptyValueKey?: string };

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        placeholder?: string;
        placeholderKey?: string;
        disabled?: boolean;
        value?: T[];
        classes?: string[];
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        options: { labelKey?: string; label?: string; value: T }[];
        inputable?: { nullValue?: string; nullValueKey?: string; emptyValue?: string; emptyValueKey?: string };
    }) {
        super(options);
        this.placeholder = options.placeholder;
        this.placeholderKey = options.placeholderKey;
        this.options = options.options;
        this.inputable = options.inputable;
    }
}

export class SlideToggleField extends FormFieldBase<boolean> {
    controlType = ControlType.slideToggle;

    constructor(options: {
        key: string;
        label?: string;
        labelKey?: string;
        disabled?: boolean;
        value?: boolean;
        classes?: string[];
        styles?: Partial<CSSStyleDeclaration>;
        brakes?: BootstrapBrakes;
        validators?: IFormFieldValidator[];
        asyncValidators?: IFormFieldAsyncValidator[];
        order?: number;
        visible?: boolean;
        refresh$?: EventEmitter<void>;
        type?: HtmlInputType;
    }) {
        super(options);
    }
}

export class ArrayField<T> extends FormFieldBase<T[]> {
    controlType = ControlType.array;
    field: FormFieldBase<T> | GroupField;
    addButtonLabel?: string;
    addButtonLabelKey?: string;
    delButtonLabel?: string;
    delButtonLabelKey?: string;
    fieldContainerClasses?: string[];

    constructor(
        options: {
            key: string;
            value?: T[];
            label?: string;
            labelKey?: string;
            addButtonLabel?: string;
            addButtonLabelKey?: string;
            delButtonLabel?: string;
            delButtonLabelKey?: string;
            classes?: string[];
            fieldContainerClasses?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            disabled?: boolean;
            visible?: boolean;
            field: FormFieldBase<T> | GroupField;
        }
    ) {
        super(options);
        this.field = options.field;
        this.addButtonLabel = options.addButtonLabel;
        this.addButtonLabelKey = options.addButtonLabelKey;
        this.delButtonLabel = options.delButtonLabel;
        this.delButtonLabel = options.delButtonLabel;
        this.fieldContainerClasses = options.fieldContainerClasses;
    }

    getArray(): FormArray {
        const noItems = this.value?.length ?? 0;
        const controls: AbstractControl[] = [];
        for (let i = 0; i < noItems; ++i) {
            controls.push(this.getControl());
        }

        const formArray = new FormArray(controls);

        if (this.disabled) {
            formArray.disable();
        }

        this.validators && formArray.setValidators(this.validators.map((v: IFormFieldValidator) => v.validator));
        this.asyncValidators && formArray.setAsyncValidators(this.asyncValidators.map((v: IFormFieldAsyncValidator) => v.validator));

        if (this.value?.length) {
            formArray.patchValue(this.value);
        }

        return formArray;
    }

    getControl(): AbstractControl {
        return this.field instanceof GroupField
            ? this.field.getGroup()
            : this.field.getControl();
    }
}

export type HtmlInputType = 'button' | 'checkbox' | 'color' | 'date' | 'datetimeocal' | 'email' | 'file' | 'hidden' | 'image' | 'month' |
    'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week' | '';

export interface IFormFieldValidatorBase<TValidator extends ValidatorFn | AsyncValidatorFn> {
    validator: TValidator;
    validatorErrorCode?: string;
    dependsOnValidatorKey?: string[];
    validatorErrorMessage?: string;
    validatorErrorMessageKey?: string;
}

export type IFormFieldValidator = IFormFieldValidatorBase<ValidatorFn>;

export interface IFormFieldAsyncValidator extends IFormFieldValidatorBase<AsyncValidatorFn> {
    pendingMessage?: string;
    pendingMessageKey?: string;
}
