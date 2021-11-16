import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import {
    AutoCompleteField,
    ChipAutoCompleteField,
    ChipInputField,
    DatePickerField,
    DropdownField,
    GroupField,
    HiddenField,
    InputField,
    SlideToggleField,
    TextAreaField
} from '../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../src/app/features/dynamic-form/dynamic-form.module';
import { DynamicFormService } from '../../../../src/app/features/dynamic-form/dynamic-form.service';

describe('app/features/dynamic-form/DynamicFormService', () => {
    let sut: DynamicFormService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DynamicFormModule]
        });
        sut = TestBed.inject(DynamicFormService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#getFormGroup should return form group', () => {
        // arrange

        // act
        const res = sut.getFormGroup([
            new HiddenField({ key: 'field1', order: 2 })
        ]);

        // assert
        expect(res).toBeInstanceOf(FormGroup);
    });

    it('#getFormGroup should return form group ordered field2, then field 1', () => {
        // arrange

        // act
        const res = sut.getFormGroup([
            new HiddenField({ key: 'field1', order: 2 }),
            new HiddenField({ key: 'field2', order: 1 }),
        ]);

        // assert
        expect(Object.keys(res.controls)).toEqual(['field2', 'field1']);
    });

    it('#getFormGroup should return form group ordered field2, then field 1', () => {
        // arrange
        const res = sut.getFormGroup([
            new HiddenField({ key: 'field1', order: 2 }),
            new HiddenField({ key: 'field2', order: 1 }),
            new GroupField({ key: 'group', fields: [] }, sut)
        ]);

        // act

        // assert
        expect(res.get('group')).toBeInstanceOf(FormGroup);
    });

    it('#createHiddenField should return instanceof HiddenField', () => {
        // arrange

        // act
        const res = sut.createHiddenField({} as any);

        // assert
        expect(res).toBeInstanceOf(HiddenField);
    });

    it('#createInputField should return instanceof InputField', () => {
        // arrange

        // act
        const res = sut.createInputField({} as any);

        // assert
        expect(res).toBeInstanceOf(InputField);
    });

    it('#createTextAreaField should return instanceof TextAreaField', () => {
        // arrange

        // act
        const res = sut.createTextAreaField({} as any);

        // assert
        expect(res).toBeInstanceOf(TextAreaField);
    });

    it('#createDropdownField should return instanceof DropdownField', () => {
        // arrange

        // act
        const res = sut.createDropdownField({} as any);

        // assert
        expect(res).toBeInstanceOf(DropdownField);
    });

    it('#createAutoCompleteField should return instanceof AutoCompleteField', () => {
        // arrange

        // act
        const res = sut.createAutoCompleteField({} as any);

        // assert
        expect(res).toBeInstanceOf(AutoCompleteField);
    });

    it('#createDatePickerField should return instanceof DatePickerField', () => {
        // arrange

        // act
        const res = sut.createDatePickerField({} as any);

        // assert
        expect(res).toBeInstanceOf(DatePickerField);
    });

    it('#createGroupField should return instanceof GroupField', () => {
        // arrange

        // act
        const res = sut.createGroupField({} as any);

        // assert
        expect(res).toBeInstanceOf(GroupField);
    });

    it('#createChipInputField should return instanceof ChipInputField', () => {
        // arrange

        // act
        const res = sut.createChipInputField({} as any);

        // assert
        expect(res).toBeInstanceOf(ChipInputField);
    });

    it('#createChipAutoCompleteField should return instanceof ChipAutoCompleteField', () => {
        // arrange

        // act
        const res = sut.createChipAutoCompleteField({} as any);

        // assert
        expect(res).toBeInstanceOf(ChipAutoCompleteField);
    });

    it('#createSlideToggleField should return instanceof SlideToggleField', () => {
        // arrange

        // act
        const res = sut.createSlideToggleField({} as any);

        // assert
        expect(res).toBeInstanceOf(SlideToggleField);
    });
});
