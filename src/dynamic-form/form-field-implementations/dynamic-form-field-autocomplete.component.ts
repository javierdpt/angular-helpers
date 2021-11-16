import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AppDataService } from '../../../core/app-data.service';
import { ENVIRONMENT, IEnvironmentSettings } from '../../../core/environment-ref.service';
import { LabelsResourcesPipe } from '../../../shared/pipes/labels-resources.pipe';
import { AutoCompleteField } from '../dynamic-form.model';


@Component({
    selector: 'app-dynamic-form-field-autocomplete',
    templateUrl: './dynamic-form-field-autocomplete.component.html'
})
export class DynamicFormFieldAutoCompleteComponent implements OnInit {
    @Input() field!: AutoCompleteField;
    @Input() control!: FormControl;
    filteredOptions!: Observable<{ labelKey?: string; label?: string; value: any }[]>;
    private _labelResourcesPipe: LabelsResourcesPipe;

    constructor(appData: AppDataService, @Inject(ENVIRONMENT) env: IEnvironmentSettings) {
        this._labelResourcesPipe = new LabelsResourcesPipe(appData, env);
    }

    ngOnInit(): void {
        this.field.options
            .filter((o: { labelKey?: string; label?: string; value: any }) => !o.label && o.labelKey)
            .forEach((o: { labelKey?: string; label?: string; value: any }) => o.label = this._labelResourcesPipe.transform(o.labelKey!));

        this.filteredOptions = this.control
            .valueChanges
            .pipe(
                startWith(''),
                map((value: string) => {
                    const filterValue = value?.toLowerCase() ?? '';
                    const res = this.field.options.filter((option: { labelKey?: string; label?: string; value: any }) =>
                        option.label!.toLowerCase().indexOf(filterValue) === 0
                    );
                    return res;
                })
            );
    }

    displayTransform = (value: string): string => this.field?.options?.find(
        (o: { labelKey?: string; label?: string; value: any }) => o.value === value)?.label ??
        value;
}
