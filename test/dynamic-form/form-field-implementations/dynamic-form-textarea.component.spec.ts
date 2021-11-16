import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextAreaField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import { DynamicFormFieldTextareaComponent } from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-textarea.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldTextareaComponent', () => {
    let sut: DynamicFormFieldTextareaComponent;
    let fixture: ComponentFixture<DynamicFormFieldTextareaComponent>;

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
        fixture = TestBed.createComponent(DynamicFormFieldTextareaComponent);
        sut = fixture.componentInstance;
        sut.field = new TextAreaField({ key: 'key' });
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
