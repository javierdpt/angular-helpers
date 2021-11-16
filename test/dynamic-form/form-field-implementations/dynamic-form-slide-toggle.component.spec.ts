import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppDataService } from '../../../../../src/app/core/app-data.service';
import { DynamicFormErrorsComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-errors.component';
import { DynamicFormPendingComponent } from '../../../../../src/app/features/dynamic-form/dynamic-form-pending.component';
import { SlideToggleField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import {
    DynamicFormFieldSlideToggleComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-slide-toggle.component';
import { SharedModule } from '../../../../../src/app/shared/shared.module';
import { TestUtils } from '../../../../core/tests-utils.model.spec';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldSlideToggleComponent', () => {
    let sut: DynamicFormFieldSlideToggleComponent;
    let fixture: ComponentFixture<DynamicFormFieldSlideToggleComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NoopAnimationsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatSlideToggleModule,
                SharedModule
            ],
            declarations: [
                DynamicFormFieldSlideToggleComponent,
                DynamicFormErrorsComponent,
                DynamicFormPendingComponent
            ],
            providers: [
                TestUtils.getMockedValueProvider(AppDataService,
                    { appendLabels: undefined },
                    { labelsResources: {} }
                )
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormFieldSlideToggleComponent);
        sut = fixture.componentInstance;
        sut.field = new SlideToggleField({ key: 'key' });
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
