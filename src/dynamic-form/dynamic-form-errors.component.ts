import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlType, FormFieldBase, IFormFieldValidatorBase } from './dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-errors',
    templateUrl: './dynamic-form-errors.component.html'
})
export class DynamicFormErrorsComponent implements OnInit {
    @Input() field!: FormFieldBase<any>;
    @Input() control!: FormControl | FormGroup | FormArray;
    controlTypeEnum = ControlType;

    validators!: {
        validatorErrorCode?: string;
        errorMessage?: string;
        errorMessageKey?: string;
        display: () => boolean;
    }[];

    ngOnInit(): void {
        this.validators =
            (this.field
                .validators
                ?.filter((v: IFormFieldValidatorBase<any>) => v.validatorErrorCode !== 'required' && !!v.validatorErrorCode)
                ?? []
            ).concat(this.field.asyncValidators ?? [])
                .map((v: IFormFieldValidatorBase<any>) => ({
                    validatorErrorCode: v.validatorErrorCode,
                    errorMessage: v.validatorErrorMessage,
                    errorMessageKey: v.validatorErrorMessageKey,
                    display: (): boolean => {
                        const hasError = this.control.touched && this.control.hasError(v.validatorErrorCode as string);
                        if (v.dependsOnValidatorKey?.length) {
                            return v.dependsOnValidatorKey.every((vk: string) => !this.control.hasError(vk)) && hasError;
                        }
                        return hasError;
                    }
                }));
    }
}
