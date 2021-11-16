import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import dayjs from 'dayjs';
import { DatePickerField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import { DynamicFormFieldDatePickerComponent } from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-date-picker.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldDatePickerComponent', () => {
    let sut: DynamicFormFieldDatePickerComponent;
    let fixture: ComponentFixture<DynamicFormFieldDatePickerComponent>;
    let refresh$: EventEmitter<void>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DynamicFormModule,
                NoopAnimationsModule
            ],
            declarations: [DynamicFormFieldDatePickerComponent],
            providers: [
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldDatePickerComponent);
        sut = fixture.componentInstance;
        refresh$ = new EventEmitter<void>();
        sut.field = new DatePickerField({ key: 'key', refresh$ });
        sut.control = new FormControl();
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#ngOnInit should initialize min with value from dateRestrictions', () => {
        // arrange
        const minDate = dayjs().subtract(10, 'day').toDate();
        sut.field = new DatePickerField({
            key: 'key',
            refresh$,
            dateRestrictions: { min: minDate }
        });

        // act
        sut.ngOnInit();

        // assert
        expect(sut.min).toEqual(minDate);
    });

    it('#ngOnInit should initialize max with value from dateRestrictions', () => {
        // arrange
        const maxDate = dayjs().add(10, 'day').toDate();
        sut.field = new DatePickerField({
            key: 'key',
            refresh$,
            dateRestrictions: { max: maxDate }
        });

        // act
        sut.ngOnInit();

        // assert
        expect(sut.max).toEqual(maxDate);
    });

    describe('#_init', () => {
        const setupMaxDateChangeWithRefresh = (): Date => {
            const maxDate = dayjs().add(10, 'day').toDate();
            sut.field = new DatePickerField({
                key: 'key',
                refresh$,
                dateRestrictions: { max: undefined, min: undefined }
            });
            sut.ngOnInit();

            if (sut.field.dateRestrictions) {
                sut.field.dateRestrictions.max = maxDate;
            }
            refresh$.emit();
            return maxDate;
        };

        it('#_init should should initialize max with value from dateRestrictions when refresh$ emits value', () => {
            // arrange

            // act
            const maxDate = setupMaxDateChangeWithRefresh();

            // assert
            expect(sut.max).toEqual(maxDate);
        });

        it('#_init should should call changeDetectorRef.detectChanges when refresh$ emits value', () => {
            // arrange
            const changeDetectorRef = fixture.debugElement.injector.get(ChangeDetectorRef);
            const detectChangesSpy = spyOn(changeDetectorRef.constructor.prototype, 'detectChanges');

            // act
            setupMaxDateChangeWithRefresh();

            // assert
            expect(detectChangesSpy).toHaveBeenCalled();
        });
    });
});
