import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppDataService } from '../../../../../src/app/core/app-data.service';
import { DynamicFormErrorsComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-errors.component';
import { DynamicFormPendingComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-pending.component';
import { ChipInputField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import {
    DynamicFormFieldChipInputComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-chip-input.component';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { TestUtils } from '../../../../core/tests-utils.model.spec';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldChipInputComponent', () => {
    let sut: DynamicFormFieldChipInputComponent;
    let fixture: ComponentFixture<DynamicFormFieldChipInputComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NoopAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatChipsModule,
                SharedModule
            ],
            declarations: [
                DynamicFormFieldChipInputComponent,
                DynamicFormErrorsComponent,
                DynamicFormPendingComponent
            ],
            providers: [
                TestUtils.getMockedValueProvider(AppDataService,
                    { appendLabels: undefined },
                    { labelsResources: {} }
                )
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldChipInputComponent);
        sut = fixture.componentInstance;
        sut.field = new ChipInputField({ key: 'key' });
        sut.control = new FormControl();
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#add', () => {
        it('should add item to control', () => {
            // arrange
            const chipEvent = { value: 'Item1', input: { value: 'InputValue' } } as MatChipInputEvent;

            // act
            sut.add(chipEvent);

            // assert
            expect(sut.control.value).toEqual(['Item1']);
        });

        it('should add item to control with existing values', () => {
            // arrange
            sut.control.setValue(['Item0']);
            const chipEvent = { value: 'Item1' } as MatChipInputEvent;

            // act
            sut.add(chipEvent);

            // assert
            expect(sut.control.value).toEqual(['Item0', 'Item1']);
        });

        it('should set event.input.value to empty string', () => {
            // arrange
            const chipEvent = { value: 'Item1', input: { value: 'InputValue' } } as MatChipInputEvent;

            // act
            sut.add(chipEvent);

            // assert
            expect(chipEvent.input.value).toBe('');
        });

        it('should not throw if event.value is undefined', () => {
            // arrange
            const chipEvent = {} as MatChipInputEvent;

            // act
            const act = (): void => sut.add(chipEvent);

            // assert
            expect(act).not.toThrow();
        });
    });

    describe('#remove', () => {
        it('should remove item in 2 in the controls value', () => {
            // arrange
            sut.control.setValue(['Item1', 'Item2', 'Item3', 'Item4']);

            // act
            sut.remove(2);

            // assert
            expect(sut.control.value).toEqual(['Item1', 'Item2', 'Item4']);
        });
    });

    describe('#hasError', () => {
        it('should return true', () => {
            // arrange
            sut.control.markAsTouched();
            sut.control.setErrors({ required: true });

            // act
            const res = sut.hasError();

            // assert
            expect(res).toBeTrue();
        });

        it('should return false when is not touched', () => {
            // arrange
            sut.control.markAsUntouched();
            sut.control.setErrors({ required: true });

            // act
            const res = sut.hasError();

            // assert
            expect(res).toBeFalse();
        });

        it('should return false when is touched but it does not have an error', () => {
            // arrange
            sut.control.markAsTouched();
            sut.control.setErrors(null);

            // act
            const res = sut.hasError();

            // assert
            expect(res).toBeFalse();
        });
    });
});
