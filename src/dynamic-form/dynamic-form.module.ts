import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from '../../shared/shared.module';
import { DynamicFormErrorsComponent } from './dynamic-form-errors.component';
import { DynamicFormFieldComponent } from './dynamic-form-field.component';
import { DynamicFormPendingComponent } from './dynamic-form-pending.component';
import { DynamicFormComponent } from './dynamic-form.component';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicFormFieldArrayComponent } from './form-field-implementations/dynamic-form-field-array.component';
import { DynamicFormFieldAutoCompleteComponent } from './form-field-implementations/dynamic-form-field-autocomplete.component';
import { DynamicFormFieldChipAutoCompleteComponent } from './form-field-implementations/dynamic-form-field-chip-autocomplete.component';
import { DynamicFormFieldChipInputComponent } from './form-field-implementations/dynamic-form-field-chip-input.component';
import { DynamicFormFieldDatePickerComponent } from './form-field-implementations/dynamic-form-field-date-picker.component';
import { DynamicFormFieldDropDownComponent } from './form-field-implementations/dynamic-form-field-dropdown.component';
import { DynamicFormFieldGroupComponent } from './form-field-implementations/dynamic-form-field-group.component';
import { DynamicFormFieldInputComponent } from './form-field-implementations/dynamic-form-field-input.component';
import { DynamicFormFieldSlideToggleComponent } from './form-field-implementations/dynamic-form-field-slide-toggle.component';
import { DynamicFormFieldTextareaComponent } from './form-field-implementations/dynamic-form-field-textarea.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatSlideToggleModule,

        SharedModule
    ],
    declarations: [
        DynamicFormComponent,
        DynamicFormFieldComponent,
        DynamicFormErrorsComponent,
        DynamicFormPendingComponent,
        DynamicFormFieldDatePickerComponent,
        DynamicFormFieldInputComponent,
        DynamicFormFieldDatePickerComponent,
        DynamicFormFieldDropDownComponent,
        DynamicFormFieldTextareaComponent,
        DynamicFormFieldAutoCompleteComponent,
        DynamicFormFieldGroupComponent,
        DynamicFormFieldChipInputComponent,
        DynamicFormFieldChipAutoCompleteComponent,
        DynamicFormFieldSlideToggleComponent,
        DynamicFormFieldArrayComponent
    ],
    exports: [
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSelectModule,
        MatAutocompleteModule,

        DynamicFormComponent,
        DynamicFormFieldComponent
    ],
    providers: [
        DynamicFormService
    ]
})
export class DynamicFormModule { }
