import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { DynamicFormPendingComponent } from '../../../../src/app/features/dynamic-form/dynamic-form-pending.component';
import { HiddenField } from '../../../../src/app/features/dynamic-form/dynamic-form.model';

describe('app/features/dynamic-form/DynamicFormPendingComponent', () => {
    let sut: DynamicFormPendingComponent;
    let fixture: ComponentFixture<DynamicFormPendingComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DynamicFormPendingComponent
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormPendingComponent);
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

    it('#ngOnInit should initialize pending', () => {
        // arrange

        // act
        sut.ngOnInit();

        // assert
        expect(sut).toBeDefined();
    });

    it('#ngOnInit should initialize with one pending validator', () => {
        // arrange
        sut.field.asyncValidators = [{
            validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
            validatorErrorCode: 'asyncVal'
        }];

        // act
        sut.ngOnInit();

        // assert
        expect(sut).toBeDefined();
    });

    it('pending[].display should be true', () => {
        // arrange
        sut.field.asyncValidators = [{
            validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
            validatorErrorCode: 'asyncVal'
        }];
        sut.control.markAsPending();

        // act
        sut.ngOnInit();

        // assert
        expect(sut.pending[0].display()).toBeTrue();
    });

    it('pending[].display should be false depending on a validator that is not set', () => {
        // arrange
        sut.field.asyncValidators = [{
            validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
            validatorErrorCode: 'asyncVal',
            dependsOnValidatorKey: ['error']
        }];
        sut.control.markAsPending();

        // act
        sut.ngOnInit();

        // assert
        expect(sut.pending[0].display()).toBeTrue();
    });

    it('pending[].display should be false depending on a validator that is in error', () => {
        // arrange
        sut.field.asyncValidators = [{
            validator: (_control: AbstractControl): Observable<ValidationErrors | null> => of(null),
            validatorErrorCode: 'asyncVal',
            dependsOnValidatorKey: ['error']
        }];
        sut.control.markAsPending();
        sut.control.setErrors({ error: false });

        // act
        sut.ngOnInit();

        // assert
        expect(sut.pending[0].display()).toBeFalse();
    });
});
