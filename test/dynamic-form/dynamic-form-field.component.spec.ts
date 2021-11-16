import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormFieldComponent } from '../../../../src/app/features/dynamic-form/dynamic-form-field.component';
import {
    ArrayField,
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
import { DynamicFormService } from '../../../../src/app/features/dynamic-form/dynamic-form.service';

describe('app/features/dynamic-form/DynamicFormFieldComponent', () => {
    let sut: DynamicFormFieldComponent;
    let fixture: ComponentFixture<DynamicFormFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [DynamicFormFieldComponent],
            providers: []
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldComponent);
        sut = fixture.componentInstance;
        sut.field = new HiddenField({ key: 'hiddenField' });
        sut.form = new FormGroup({ hiddenField: new FormControl() });
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#hostClasses should return class, dynamic-form-field and field classes joined', () => {
        // arrange
        sut.class = 'class1';
        sut.field.classes = ['class2', 'class3'];

        // act
        const res = sut.hostClasses;

        // assert
        expect(res).toBe('class1 dynamic-form-field class2 class3');
    });

    it('#formGroup should return a FormGroup instance', () => {
        // arrange
        sut.field = new GroupField({ key: 'field', fields: [] }, new DynamicFormService());
        sut.form.addControl('field', new FormGroup({ field2: new FormControl() }));

        // act
        const res = sut.formGroup;

        // assert
        expect(res).toBeInstanceOf(FormGroup);
    });

    it('#inputField should return a InputField instance', () => {
        // arrange
        sut.field = new InputField({ key: 'field' });

        // act
        const res = sut.inputField;

        // assert

        expect(res).toBeInstanceOf(InputField);
    });

    it('#datePickerField should return a DatePickerField instance', () => {
        // arrange
        sut.field = new DatePickerField({ key: 'field' });

        // act
        const res = sut.datePickerField;

        // assert
        expect(res).toBeInstanceOf(DatePickerField);
    });

    it('#dropDownField should return a DropDownField instance', () => {
        // arrange
        sut.field = new DropdownField({ key: 'field' });

        // act
        const res = sut.dropDownField;

        // assert
        expect(res).toBeInstanceOf(DropdownField);
    });

    it('#autoCompleteField should return a AutoCompleteField instance', () => {
        // arrange
        sut.field = new AutoCompleteField({ key: 'field' });

        // act
        const res = sut.autoCompleteField;

        // assert
        expect(res).toBeInstanceOf(AutoCompleteField);
    });

    it('#textAreaField should return a TextAreaField instance', () => {
        // arrange
        sut.field = new TextAreaField({ key: 'field' });

        // act
        const res = sut.textAreaField;

        // assert
        expect(res).toBeInstanceOf(TextAreaField);
    });

    it('#groupField should return a GroupField instance', () => {
        // arrange
        sut.field = new GroupField({ key: 'field', fields: [] }, new DynamicFormService());

        // act
        const res = sut.groupField;

        // assert
        expect(res).toBeInstanceOf(GroupField);
    });

    it('#chipInputField should return a ChipInputField instance', () => {
        // arrange
        sut.field = new ChipInputField({ key: 'field' });

        // act
        const res = sut.chipInputField;

        // assert
        expect(res).toBeInstanceOf(ChipInputField);
    });

    it('#chipAutoCompleteField should return a ChipAutoCompleteField instance', () => {
        // arrange
        sut.field = new ChipAutoCompleteField({ key: 'field', options: [] });

        // act
        const res = sut.chipAutoCompleteField;

        // assert
        expect(res).toBeInstanceOf(ChipAutoCompleteField);
    });

    it('#slideToggleCompleteField should return a SlideToggleField instance', () => {
        // arrange
        sut.field = new SlideToggleField({ key: 'field' });

        // act
        const res = sut.slideToggleCompleteField;

        // assert
        expect(res).toBeInstanceOf(SlideToggleField);
    });

    describe('#get formControl', () => {
        it('should return fieldControl', () => {
            // arrange
            sut.fieldControl = new FormControl();

            // act
            const res = sut.formControl;

            // assert
            expect(res as AbstractControl).toBe(sut.fieldControl as AbstractControl);
        });

        it('should return form["hiddenField"]', () => {
            // arrange
            sut.fieldControl = undefined;

            // act
            const res = sut.formControl;

            // assert
            expect(res as AbstractControl).toBe(sut.form.get(sut.field.key) as AbstractControl);
        });
    });

    describe('#get formGroup', () => {
        it('should return fieldControl', () => {
            // arrange
            sut.fieldControl = new FormControl();

            // act
            const res = sut.formGroup;

            // assert
            expect(res as AbstractControl).toBe(sut.fieldControl as AbstractControl);
        });

        it('should return form', () => {
            // arrange
            sut.fieldControl = undefined;

            // act
            const res = sut.formGroup;

            // assert
            expect(res as AbstractControl).toBe(sut.form.get(sut.field.key) as AbstractControl);
        });
    });

    describe('#get FormArray', () => {
        it('should return a FormArray', () => {
            // arrange
            sut.field = new ArrayField({ key: 'array', field: new HiddenField({ key: 'hidden' }) });
            sut.form = new FormGroup({ array: new FormArray([]) });

            // act
            const res = sut.formArray;

            // assert
            expect(res).toBeInstanceOf(FormArray);
        });
    });

    describe('#get arrayField', () => {
        it('should return a ArrayField', () => {
            // arrange
            sut.field = new ArrayField({ key: 'array', field: new HiddenField({ key: 'hidden' }) });

            // act
            const res = sut.arrayField;

            // assert
            expect(res).toBeInstanceOf(ArrayField);
        });
    });
});
