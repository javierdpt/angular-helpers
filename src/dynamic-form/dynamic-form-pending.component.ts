import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ControlType, FormFieldBase, IFormFieldAsyncValidator } from './dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-pending',
    templateUrl: './dynamic-form-pending.component.html'
})
export class DynamicFormPendingComponent implements OnInit {
    @Input() field!: FormFieldBase<any>;
    @Input() control!: FormControl | FormGroup | FormArray;
    controlTypeEnum = ControlType;

    pending!: {
        pendingMessage?: string;
        pendingMessageKey?: string;
        display: () => boolean;
    }[];

    ngOnInit(): void {
        this.pending = this.field.asyncValidators
            ?.map((v: IFormFieldAsyncValidator) => ({
                pendingMessage: v.pendingMessage,
                pendingMessageKey: v.pendingMessageKey,
                display: (): boolean => v.dependsOnValidatorKey?.length
                    ? v.dependsOnValidatorKey.every((vk: string) => !this.control.hasError(vk)) && this.control.pending
                    : this.control.pending
            })) ?? [];
    }
}
