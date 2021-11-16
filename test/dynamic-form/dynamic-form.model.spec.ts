import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ArrayField, GroupField, HiddenField } from '../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormService } from '../../../../src/app/features/dynamic-form/dynamic-form.service';

describe('app/features/dynamic-form/DynamicFormModel', () => {
    it('#getControl should return FormControl', () => {
        // arrange
        const sut = new HiddenField({
            key: 'hidden'
        });

        // act
        const res = sut.getControl();

        // assert
        expect(res).toBeInstanceOf(FormControl);
    });

    it('#getControl should return FormControl with value set to fieldValue', () => {
        // arrange
        const sut = new HiddenField({
            key: 'hidden',
            value: 'InitialVal'
        });

        // act
        const res = sut.getControl();

        // assert
        expect(res.value).toBe('InitialVal');
    });

    it('#getControl should return FormControl with value set to initialVal argument', () => {
        // arrange
        const sut = new HiddenField({
            key: 'hidden'
        });

        // act
        const res = sut.getControl('InitialVal');

        // assert
        expect(res.value).toBe('InitialVal');
    });

    it('#getControl should add validators', () => {
        // arrange
        const sut = new HiddenField({
            key: 'hidden',
            validators: [{
                validator: Validators.maxLength(5),
                validatorErrorCode: 'maxlength'
            }]
        });

        // act
        const res = sut.getControl('InitialVal');

        // assert
        expect((res as any)._rawValidators.length).toBeTruthy();
    });

    it('#getControl should add asyncValidators', () => {
        // arrange
        const sut = new HiddenField({
            key: 'hidden',
            asyncValidators: [{
                validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
                validatorErrorCode: 'asyncVal'
            }]
        });

        // act
        const res = sut.getControl('InitialVal');

        // assert
        expect((res as any)._rawAsyncValidators.length).toBeTruthy();
    });

    it('#getGroup should return FromGroup with validators and asyncValidators', () => {
        // arrange
        const sut = new GroupField(
            {
                key: 'hidden',
                validators: [{
                    validator: (_control: AbstractControl): any => null,
                    validatorErrorCode: 'maxlength'
                }],
                asyncValidators: [{
                    validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
                    validatorErrorCode: 'asyncVal'
                }],
                fields: []
            },
            new DynamicFormService()
        );

        // act
        const res = sut.getGroup();

        // assert
        expect(res).toBeInstanceOf(FormGroup);
        expect((res as any)._rawAsyncValidators.length).toBeTruthy();
        expect((res as any)._rawValidators.length).toBeTruthy();
    });

    it('#getGroup should disable the FormGroup', () => {
        // arrange
        const sut = new GroupField(
            {
                key: 'hidden',
                disabled: true,
                validators: [{
                    validator: (_control: AbstractControl): any => null,
                    validatorErrorCode: 'maxlength'
                }],
                asyncValidators: [{
                    validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
                    validatorErrorCode: 'asyncVal'
                }],
                fields: []
            },
            new DynamicFormService()
        );

        // act
        const res = sut.getGroup();

        // assert
        expect(res.disabled).toBeTrue();
    });
});

describe('app/features/dynamic-form/FormArray', () => {
    let sut: ArrayField<any>;

    beforeEach(() => {
        sut = new ArrayField({
            key: 'key',
            field: new HiddenField<string>({ key: 'hiddenField' })
        });
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeDefined();
    });

    describe('#getArray', () => {
        it('should return FormArray', () => {
            // arrange

            // act
            const res = sut.getArray();

            // assert
            expect(res).toBeInstanceOf(FormArray);
        });

        it('should generate a FormArray with two controls', () => {
            // arrange
            sut.value = ['string1', 'string2'];

            // act
            const res = sut.getArray();

            // assert
            expect(res.controls).toHaveSize(2);
        });

        it('should mark FormArray disabled', () => {
            // arrange
            sut.disabled = true;

            // act
            const res = sut.getArray();

            // assert
            expect(res.disabled).toBeTrue();
        });

        it('should add validators and async validators', () => {
            // arrange
            sut.validators = [
                { validator: jasmine.createSpy() }
            ];
            const asyncValStub = jasmine.createSpy();
            asyncValStub.and.returnValue(of(null));
            sut.asyncValidators = [
                { validator: asyncValStub }
            ];
            const array = sut.getArray();
            array.push(new FormControl());

            // act
            array.patchValue(['']);

            // assert
            expect(sut.validators[0].validator).toHaveBeenCalled();
            expect(asyncValStub).toHaveBeenCalled();
        });
    });

    describe('#getControl', () => {
        it('should return FormControl', () => {
            // arrange

            // act
            const res = sut.getControl();

            // assert
            expect(res).toBeInstanceOf(FormControl);
        });

        it('should return FormGroup', () => {
            // arrange
            sut.field = new GroupField({ key: '', fields: [] }, new DynamicFormService());

            // act
            const res = sut.getControl();

            // assert
            expect(res).toBeInstanceOf(FormGroup);
        });
    });
});
