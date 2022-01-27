import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { merge, Observable } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AppDataService } from '../../../core/app-data.service';
import { ENVIRONMENT, IEnvironmentSettings } from '../../../core/environment-ref.service';
import { BaseUnsubscribeComponent } from '../../../models/base-unsubscribe-component.model';
import { LabelsResourcesPipe } from '../../../shared/pipes/labels-resources.pipe';
import { slideInOutAnimation } from '../dynamic-form-animations.const';
import { ChipAutoCompleteField } from '../dynamic-form.model';

@Component({
    selector: 'app-dynamic-form-field-chip-autocomplete',
    templateUrl: './dynamic-form-field-chip-autocomplete.component.html',
    animations: [slideInOutAnimation]
})
export class DynamicFormFieldChipAutoCompleteComponent extends BaseUnsubscribeComponent implements OnInit {
    @Input() field!: ChipAutoCompleteField<any>;
    @Input() control!: FormControl;
    @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete!: MatAutocomplete;
    acControl = new FormControl();
    filteredOptions$!: Observable<{ labelKey?: string; label?: string; value: any }[]>;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    private _labelsResourcesPipe: LabelsResourcesPipe;

    constructor(appData: AppDataService, @Inject(ENVIRONMENT) env: IEnvironmentSettings) {
        super();
        this._labelsResourcesPipe = new LabelsResourcesPipe(appData, env);
    }

    get controlValue(): any[] {
        return this.control.value?.length
            ? this.control.value : [];
    }

    ngOnInit(): void {
        this.filteredOptions$ = merge(
            this.acControl.valueChanges,
            this.control.valueChanges
        ).pipe(
            startWith(null),
            map(() => {
                const search = this.acControl.value;
                return (search
                    ? this._filter(search)
                    : this.field.options
                ).filter((o: { labelKey?: string; label?: string; value: any }) =>
                    !this.controlValue.some(cv => o.value === cv)
                );
            }),
            takeUntil(this._stop$)
        );
    }

    remove(i: number): void {
        const controlValue: string[] = this.control.value;
        controlValue.splice(i, 1);
        this.control.setValue(controlValue);
    }

    add(): void {
        this._addValueToControl(this.acControl.value);
        this.searchInput.nativeElement.value = '';
        this.acControl.setValue(null);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this._addValueToControl(event.option.value);
        this.searchInput.nativeElement.value = '';
        this.acControl.setValue(null);
    }

    hasError(): boolean {
        return this.control.touched && !!this.control.errors;
    }

    getFalsyValueStringRep(value: null | ''): string {
        if (this.field.inputable) {
            if (value === null) {
                return this._getLabel(this.field.inputable.nullValueKey, this.field.inputable.nullValue);
            }
            if (value === '') {
                return this._getLabel(this.field.inputable.emptyValueKey, this.field.inputable.emptyValue);
            }
        }

        return '';
    }

    getOptionFromValue(value: any): { labelKey?: string; label?: string; value: any } | undefined {
        return this.field.options.find(o => o.value === value) ?? value;
    }

    private _addValueToControl(value: string | null | undefined): void {
        if (value === undefined) { return; }

        const controlValue = this.controlValue;
        controlValue.push(value && this._isString(value) ? value.trim() : value);
        this.control.setValue(controlValue);
    }

    private _filter(value: string | any): { labelKey?: string; label?: string; value: any }[] {
        const filterValue = this._isString(value) ? value.toLowerCase() : value;
        return this.field.options
            .filter((op: { labelKey?: string; label?: string; value: any }) => {
                if (this._isString(op.value) || op.value === null || op.value === '') {
                    return (!!op.value ? op.value : this.getFalsyValueStringRep(op.value))
                        .toLowerCase()
                        .indexOf(filterValue) !== -1;
                }

                return op.value === filterValue;
            });
    }

    private _getLabel(valueKey: string | undefined, value: string | undefined): string {
        return valueKey
            ? this._labelsResourcesPipe.transform(valueKey)
            : value ?? '';
    }

    private _isString(value: string | any): boolean {
        return typeof value === 'string';
    }
}
