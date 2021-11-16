import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import {
    DynamicFormFieldDropDownComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-dropdown.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldDropDownComponent', () => {
    let sut: DynamicFormFieldDropDownComponent;
    let fixture: ComponentFixture<DynamicFormFieldDropDownComponent>;

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
        fixture = TestBed.createComponent(DynamicFormFieldDropDownComponent);
        sut = fixture.componentInstance;
        sut.field = new DropdownField({ key: 'key' });
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
