import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicFormErrorsComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-errors.component';
import { DynamicFormPendingComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-pending.component';
import { InputField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormFieldInputComponent } from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-input.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldInputComponent', () => {
    let sut: DynamicFormFieldInputComponent;
    let fixture: ComponentFixture<DynamicFormFieldInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule
            ],
            declarations: [
                DynamicFormFieldInputComponent,
                DynamicFormErrorsComponent,
                DynamicFormPendingComponent
            ],
            providers: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldInputComponent);
        sut = fixture.componentInstance;
        sut.field = new InputField({ key: 'key' });
        sut.control = new FormControl();
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
