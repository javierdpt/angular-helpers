import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { skip, take, takeUntil } from 'rxjs/operators';
import { AppDataService } from '../../../../../src/app/core/app-data.service';
import { ChipAutoCompleteField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import {
    DynamicFormFieldChipAutoCompleteComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-chip-autocomplete.component';
import { TestUtils } from '../../../../core/tests-utils.model.spec';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldChipAutoCompleteComponent', () => {
    let sut: DynamicFormFieldChipAutoCompleteComponent;
    let fixture: ComponentFixture<DynamicFormFieldChipAutoCompleteComponent>;
    let subscriptionsRemover$: Subject<void>;

    beforeEach(async () => {
        subscriptionsRemover$ = new Subject<void>();
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                DynamicFormModule,
                MatChipsModule,
                MatAutocompleteModule,
                NoopAnimationsModule
            ],
            declarations: [],
            providers: [
                TestUtils.getValueProvider(AppDataService, {
                    labelsResources: {
                        nullValue: 'Null Value',
                        emptyValue: 'Empty Value'
                    }
                } as unknown as AppDataService)
            ]
        }).compileComponents();
    });

    afterEach(() => {
        subscriptionsRemover$.next();
        subscriptionsRemover$.complete();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldChipAutoCompleteComponent);
        sut = fixture.componentInstance;
        sut.field = new ChipAutoCompleteField({ key: 'key', options: [] });
        sut.control = new FormControl();
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#ngOnInit', () => {
        it('should init filteredOptions$ ', () => {
            // arrange

            // act
            const res = sut.filteredOptions$;

            // assert
            expect(res).toBeDefined();
        });
    });

    describe('filteredOptions$', () => {
        beforeEach(() => {
            sut.field.inputable = {
                emptyValueKey: 'emptyValue',
                nullValueKey: 'nullValue'
            };
            sut.field.options = [
                { label: 'lb1', value: 'asdf2' },
                { label: 'lb2', value: 'qwe1r3' },
                { label: 'lb3', value: 'zxvc2' },
                { label: 'lb4', value: 'yuio1' },
                { label: 'lb5', value: 'hjkl5' },
                { label: 'lb6', value: 'nm,5.' }
            ];
        });

        it('should return two items when asControl value changes with "2"', (done: DoneFn) => {
            // arrange

            sut.filteredOptions$
                .pipe(skip(1), takeUntil(subscriptionsRemover$))
                .subscribe((res: {
                    labelKey?: string;
                    label?: string;
                    value: any;
                }[]) => {
                    // assert
                    expect(res.length).toBe(2);
                    done();
                });

            // act
            sut.acControl.setValue('2');
        });

        it('should return 4 items when control value changes and have two values (remove selected items)', (done: DoneFn) => {
            // arrange

            // assert
            sut.filteredOptions$
                .pipe(skip(1), takeUntil(subscriptionsRemover$))
                .subscribe((res: {
                    labelKey?: string;
                    label?: string;
                    value: any;
                }[]) => {
                    expect(res.length).toBe(4);
                    done();
                });

            // act
            sut.control.setValue(['asdf2', 'hjkl5']);
        });

        it('should not contains "Null value" when present already selected', (done: DoneFn) => {
            // arrange
            const nullValueOption = { labelKey: 'nullValue', value: null };
            sut.field.options.push(nullValueOption);

            // act
            sut.control.setValue([null, 'asdf2']);

            // assert
            sut.filteredOptions$
                .pipe(take(1))
                .subscribe(options => {
                    expect(options).not.toContain(nullValueOption);
                    expect(options.length).toBe(5);
                    done();
                });
        });

        it('should return nullValue when searching for "Null"', (done: DoneFn) => {
            // arrange
            const nullValueOption = { labelKey: 'nullValue', value: null };
            sut.field.options.push(nullValueOption);

            // act
            sut.acControl.setValue('null');

            // assert
            sut.filteredOptions$
                .pipe(take(1))
                .subscribe(options => {
                    expect(options).toContain(nullValueOption);
                    expect(options.length).toBe(1);
                    done();
                });
        });
    });

    describe('#getControlValue', () => {
        it('should return controls value', () => {
            // arrange
            sut.control.setValue(['Item1', 'Item2']);

            // act
            const res = sut.controlValue;

            // assert
            expect(res).toEqual(['Item1', 'Item2']);
        });

        it('should return empty if control.value is falsy', () => {
            // arrange
            sut.control.setValue(null);

            // act
            const res = sut.controlValue;

            // assert
            expect(res).toEqual([]);
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

    describe('#selected', () => {
        it('should add item to control value', () => {
            // arrange

            // act
            sut.selected({ option: { value: 'SelectedValue' } } as MatAutocompleteSelectedEvent);

            // assert
            expect(sut.control.value).toEqual(['SelectedValue']);
        });

        it('should set acControl value to null', () => {
            // arrange
            sut.acControl.setValue('AcControlValue');

            // act
            sut.selected({ option: { value: 'SelectedValue' } } as MatAutocompleteSelectedEvent);

            // assert
            expect(sut.acControl.value).toBeNull();
        });

        it('should set not modify control value when selected value is undefined', () => {
            // arrange
            const val = sut.control.value;

            // act
            sut.selected({ option: { value: undefined } } as MatAutocompleteSelectedEvent);

            // assert
            expect(sut.control.value).toBe(val);
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

    describe('#getFalsyValueStrRep', () => {
        it('should return empty string when field inputable is not defined', () => {
            // arrange
            sut.field.inputable = undefined;

            // act
            const res = sut.getFalsyValueStringRep(null);

            // assert
            expect(res).toBe('');
        });

        it('should return empty string when field inputable is defined but value is neither null not empty str', () => {
            // arrange
            sut.field.inputable = {};

            // act
            const res = sut.getFalsyValueStringRep('test' as any);

            // assert
            expect(res).toBe('');
        });

        it('should return field.inputable.nullValue', () => {
            // arrange
            sut.field.inputable = {
                nullValue: 'Null val string rep'
            };

            // act
            const res = sut.getFalsyValueStringRep(null);

            // assert
            expect(res).toBe('Null val string rep');
        });

        it('should return label "Null Value" from labelsResources pipe field.inputable.nullValueKey', () => {
            // arrange
            sut.field.inputable = {
                nullValueKey: 'nullValue'
            };

            // act
            const res = sut.getFalsyValueStringRep(null);

            // assert
            expect(res).toBe('Null Value');
        });

        it('should return field.inputable.emptyValue', () => {
            // arrange
            sut.field.inputable = {
                emptyValue: 'Empty val string rep'
            };

            // act
            const res = sut.getFalsyValueStringRep('');

            // assert
            expect(res).toBe('Empty val string rep');
        });

        it('should return label "Empty Value" from labelsResources pipe field.inputable.emptyValueKey', () => {
            // arrange
            sut.field.inputable = {
                emptyValueKey: 'emptyValue'
            };

            // act
            const res = sut.getFalsyValueStringRep('');

            // assert
            expect(res).toBe('Empty Value');
        });

        it('should return empty string when inputable is empty object', () => {
            // arrange
            sut.field.inputable = {};

            // act
            const res = sut.getFalsyValueStringRep('');

            // assert
            expect(res).toBe('');
        });
    });

    describe('#add & _addValueToControl', () => {
        it('should add value to control and searchInput.value to be empty string', () => {
            // arrange
            sut.acControl.setValue('Test');

            // act
            sut.add();

            // assert
            expect(sut.control.value).toEqual(['Test']);
            expect(sut.searchInput.nativeElement.value).toBe('');
        });

        it('should not brake when adding null value', () => {
            // arrange
            sut.acControl.setValue(null);

            // act
            const act = (): void => sut.add();

            // assert
            expect(act).not.toThrowError();
        });

        it('should not call control.setValue if value is undefined', () => {
            // arrange
            sut.acControl.setValue(undefined);
            const controlSetValueSpy = spyOn(sut.control, 'setValue');

            // act
            sut.add();

            // assert
            expect(controlSetValueSpy).not.toHaveBeenCalled();
        });
    });
});
