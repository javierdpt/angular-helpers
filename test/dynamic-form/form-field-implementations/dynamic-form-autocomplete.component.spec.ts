import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { filter } from 'rxjs/operators';
import { AutoCompleteField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import {
    DynamicFormFieldAutoCompleteComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-autocomplete.component';
import { AngularCoreMocks } from '../../../../core/angular-core-stubs.model.spec';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldAutoCompleteComponent', () => {
    let sut: DynamicFormFieldAutoCompleteComponent;
    let fixture: ComponentFixture<DynamicFormFieldAutoCompleteComponent>;
    let control: FormControl;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DynamicFormModule,
                NoopAnimationsModule
            ],
            providers: [
                AngularCoreMocks.getRouterProvider()
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldAutoCompleteComponent);
        sut = fixture.componentInstance;
        control = new FormControl();
        sut.field = new AutoCompleteField(
            {
                key: 'key',
                options: [
                    { label: 'Item1', value: 'Item 1' },
                    { label: 'Item2', value: 'Item 2' },
                    { label: 'Item3', value: 'Other 3' },
                ]
            });
        sut.control = control;
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    const verifyFilterCount = (searchVal: string | undefined, count: number, done: DoneFn): void => {
        // arrange
        sut.ngOnInit();

        sut.filteredOptions
            .pipe(filter((_v, i: number) => i === 1)) // Filter to simulate the async pipe first subscription
            .subscribe((v: { labelKey?: string; label?: string; value: any }[]) => {
                // assert
                expect(v.length).toBe(count);
                done();
            });

        // act
        sut.control.setValue(searchVal);
    };

    describe('#ngOnInit', () => {
        it('should return one filtered values', (done: DoneFn) => verifyFilterCount('item3', 1, done));

        it('should return cero filtered values', (done: DoneFn) => verifyFilterCount('not found', 0, done));

        it('should initialize label for options when LabelKey is provided', () => {
            // arrange
            sut.field.options = [{ labelKey: 'LabelKey', value: 'Value' }];

            // act
            sut.ngOnInit();

            // assert
            expect(sut.field.options[0].label).toBeDefined();
        });

        it('should return all items when control value is undefined', (done: DoneFn) => verifyFilterCount(undefined, 3, done));
    });

    describe('#displayTransform', () => {
        it('should return value when field is undefined', () => {
            // arrange
            sut.field = null as unknown as AutoCompleteField;

            // act
            const res = sut.displayTransform('test');

            // assert
            expect(res).toBe('test');
        });

        it('should return value when not found', () => {
            // arrange

            // act
            const res = sut.displayTransform('test');

            // assert
            expect(res).toBe('test');
        });

        it('should return label value', () => {
            // arrange

            // act
            const res = sut.displayTransform('Other 3');

            // assert
            expect(res).toBe('Item3');
        });
    });
});
