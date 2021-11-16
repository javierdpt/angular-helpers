import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DynamicFormErrorsComponent } from '../../../../src/app/features/dynamic-form/dynamic-form-errors.component';
import { HiddenField } from '../../../../src/app/features/dynamic-form/dynamic-form.model';

describe('app/features/dynamic-form/DynamicFormErrorsComponent', () => {
    let sut: DynamicFormErrorsComponent;
    let fixture: ComponentFixture<DynamicFormErrorsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DynamicFormErrorsComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormErrorsComponent);
        sut = fixture.componentInstance;
        sut.field = new HiddenField({ key: 'key' });
        sut.control = new FormControl();
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#ngOnInit should initialize validators', () => {
        // arrange

        // act
        sut.ngOnInit();

        // assert
        expect(sut.validators).toBeDefined();
    });

    it('#ngOnInit should initialize validators empty ignoring required', () => {
        // arrange
        sut.field.validators = [{
            validator: Validators.required,
            validatorErrorCode: 'required'
        }];

        // act
        sut.ngOnInit();

        // assert
        expect(sut.validators.length).toBeFalsy();
    });

    it('#ngOnInit should initialize validators empty ignoring validators with null errorCode', () => {
        // arrange
        sut.field.validators = [{
            validator: Validators.maxLength(5)
        }];

        // act
        sut.ngOnInit();

        // assert
        expect(sut.validators.length).toBeFalsy();
    });

    it('#ngOnInit should add validators and async validators to the validators', () => {
        // arrange
        sut.field.validators = [{
            validator: Validators.maxLength(5),
            validatorErrorCode: 'maxlength'
        }];
        sut.field.asyncValidators = [{
            validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
            validatorErrorCode: 'asyncVal'
        }];

        // act
        sut.ngOnInit();

        // assert
        expect(sut.validators.length).toBe(2);
    });

    it('validators[].display should display an error for maxlength validator', () => {
        // arrange
        sut.control.setValidators(Validators.maxLength(5));
        sut.field.validators = [{
            validator: Validators.maxLength(5),
            validatorErrorCode: 'maxlength'
        }];
        sut.ngOnInit();
        sut.control.setValue('123456');
        sut.control.markAsTouched();
        sut.control.updateValueAndValidity();

        // act
        const res = sut.validators[0].display();

        // assert
        expect(res).toBeTrue();
    });

    it('validators[].display should display an error for being valid but depending on email validator invalid', () => {
        // arrange
        sut.control.setValidators([Validators.maxLength(5), Validators.email]);
        sut.field.validators = [
            {
                validator: Validators.maxLength(40),
                validatorErrorCode: 'maxlength',
                dependsOnValidatorKey: ['email']
            },
            {
                validator: Validators.email,
                validatorErrorCode: 'email'
            }
        ];
        sut.ngOnInit();
        sut.control.setValue('this_is_an_invalid_test_email@email');
        sut.control.markAsTouched();
        sut.control.updateValueAndValidity();

        // act
        const res = sut.validators[0].display();

        // assert
        expect(res).toBeTrue();
    });

    it('validators[].display should not display an error being maxlength and email validators valid', () => {
        // arrange
        sut.control.setValidators([Validators.maxLength(40), Validators.email]);
        sut.field.validators = [
            {
                validator: Validators.maxLength(40),
                validatorErrorCode: 'maxlength',
                dependsOnValidatorKey: ['email']
            },
            {
                validator: Validators.email,
                validatorErrorCode: 'email'
            }
        ];
        sut.ngOnInit();
        sut.control.setValue('this_is_an_invalid_test_email@email.com');
        sut.control.markAsTouched();
        sut.control.updateValueAndValidity();

        // act
        const res = sut.validators[0].display();

        // assert
        expect(res).toBeFalse();
    });
});
