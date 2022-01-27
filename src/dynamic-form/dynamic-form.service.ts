import { EventEmitter, Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BootstrapBrakes } from '../../models/classes.model';
import {
    ArrayField,
    AutoCompleteField,
    ChipAutoCompleteField,
    ChipInputField,
    DatePickerField,
    DatePikerFieldDateRestriction,
    DropdownField,
    FormFieldBase,
    GroupField,
    HiddenField,
    HtmlInputType,
    IFormFieldAsyncValidator,
    IFormFieldValidator,
    InputField,
    SlideToggleField,
    TextAreaField
} from './dynamic-form.model';

@Injectable()
export class DynamicFormService implements IDynamicFormService {
    getFormGroup(fields: FormFieldBase<any>[]): FormGroup {
        // Cloning fields to avoid mutating the original array
        const sortedFields = [...fields].sort((a: FormFieldBase<any>, b: FormFieldBase<any>) => a.order - b.order);
        const group: { [key: string]: AbstractControl } = {};

        for (let i = 0, length = sortedFields.length; i < length; ++i) {
            const field: FormFieldBase<any> = sortedFields[i];
            group[field.key] = field instanceof GroupField
                ? field.getGroup()
                : field instanceof ArrayField
                    ? field.getArray()
                    : field.getControl();
        }

        return new FormGroup(group);
    }

    createHiddenField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: TValue;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
        }
    ): HiddenField<TValue> {
        return new HiddenField<TValue>(options);
    }

    createInputField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): InputField {
        return new InputField(options);
    }

    createTextAreaField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): TextAreaField {
        return new TextAreaField(options);
    }

    createDropdownField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: TValue;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            options?: { labelKey?: string; label?: string; value: TValue }[];
        }
    ): DropdownField<TValue> {
        return new DropdownField<TValue>(options);
    }

    createAutoCompleteField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: TValue;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            options?: { labelKey?: string; label?: string; value: TValue }[];
        }
    ): AutoCompleteField<TValue> {
        return new AutoCompleteField<TValue>(options);
    }

    createDatePickerField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): DatePickerField {
        return new DatePickerField(options);
    }

    createGroupField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): GroupField {
        return new GroupField(options, this);
    }

    createChipInputField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): ChipInputField {
        return new ChipInputField(options);
    }

    createChipAutoCompleteField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            placeholder?: string;
            placeholderKey?: string;
            disabled?: boolean;
            value?: TValue[];
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            options: { labelKey?: string; label?: string; value: TValue }[];
            inputable?: { nullValue?: string; nullValueKey?: string; emptyValue?: string; emptyValueKey?: string };
        }
    ): ChipAutoCompleteField<TValue> {
        return new ChipAutoCompleteField<TValue>(options);
    }

    createSlideToggleField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): SlideToggleField {
        return new SlideToggleField(options);
    }

    createArrayField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            value?: TValue[];
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
            field: FormFieldBase<any>;
        }
    ): ArrayField<TValue> {
        return new ArrayField<TValue>(options);
    }
}

export interface IDynamicFormService {
    getFormGroup(fields: FormFieldBase<any>[]): FormGroup;

    createHiddenField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: TValue;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
        }
    ): HiddenField<TValue>;

    createInputField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): InputField;

    createTextAreaField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): TextAreaField;

    createDropdownField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: TValue;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            options?: { labelKey?: string; label?: string; value: TValue }[];
        }
    ): DropdownField<TValue>;

    createDatePickerField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): DatePickerField;

    createGroupField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): GroupField;

    createChipInputField<TEntity>(
        options: {
            key: keyof TEntity & string;
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
        }
    ): ChipInputField;

    createChipAutoCompleteField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            placeholder?: string;
            placeholderKey?: string;
            disabled?: boolean;
            value?: TValue[];
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            options: { labelKey?: string; label?: string; value: TValue }[];
            inputable?: { nullValue?: string; nullValueKey?: string; emptyValue?: string; emptyValueKey?: string };
        }
    ): ChipAutoCompleteField<TValue>;

    createSlideToggleField<TEntity>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            disabled?: boolean;
            value?: boolean;
            classes?: string[];
            brakes?: BootstrapBrakes;
            validators?: IFormFieldValidator[];
            asyncValidators?: IFormFieldAsyncValidator[];
            order?: number;
            visible?: boolean;
            refresh$?: EventEmitter<void>;
            type?: HtmlInputType;
        }
    ): SlideToggleField;

    createArrayField<TEntity, TValue = any>(
        options: {
            key: keyof TEntity & string;
            label?: string;
            labelKey?: string;
            value?: TValue[];
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
            field: FormFieldBase<any>;
        }
    ): ArrayField<TValue>;
}
