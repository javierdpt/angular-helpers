import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ArrayField, HiddenField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import {
    DynamicFormFieldArrayComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-array.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldArrayComponent', () => {
    let sut: DynamicFormFieldArrayComponent;
    let fixture: ComponentFixture<DynamicFormFieldArrayComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DynamicFormModule,
                NoopAnimationsModule
            ],
            declarations: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldArrayComponent);
        sut = fixture.componentInstance;
        sut.field = new ArrayField({
            key: 'key',
            field: new HiddenField({ key: 'hiddenFieldKey' })
        });
        sut.control = new FormArray([]);
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
