import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BaseUnsubscribeComponent } from '../../../models/base-unsubscribe-component.model';
import { DatePickerField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-date-picker',
    templateUrl: './dynamic-form-field-date-picker.component.html'
})
export class DynamicFormFieldDatePickerComponent extends BaseUnsubscribeComponent implements OnInit {
    @Input() field!: DatePickerField;
    @Input() control!: FormControl;
    min?: Date;
    max?: Date;

    constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this._init(true);
        this.field.refresh$
            ?.pipe(takeUntil(this._stop$))
            ?.subscribe(() => this._init());
    }

    protected _init(skipChangeDetector: boolean = false): void {
        let changed = false;
        if (this.field.dateRestrictions?.min) {
            this.min = this.field.dateRestrictions.min;
            changed = true;
        }
        if (this.field.dateRestrictions?.max) {
            this.max = this.field.dateRestrictions.max;
            changed = true;
        }
        !skipChangeDetector && changed && this._changeDetectorRef.detectChanges();
    }
}
