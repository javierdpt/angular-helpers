import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GroupField, HiddenField } from '../../../../../src/app/features/dynamic-form/dynamic-form.model';
import { DynamicFormModule } from '../../../../../src/app/features/dynamic-form/dynamic-form.module';
import { DynamicFormService } from '../../../../../src/app/features/dynamic-form/dynamic-form.service';
import {
    DynamicFormFieldGroupComponent
} from '../../../../../src/app/features/dynamic-form/form-field-implementations/dynamic-form-field-group.component';

describe('app/features/dynamic-form/form-field-implementations/DynamicFormFieldGroupComponent', () => {
    let sut: DynamicFormFieldGroupComponent;
    let fixture: ComponentFixture<DynamicFormFieldGroupComponent>;

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
        fixture = TestBed.createComponent(DynamicFormFieldGroupComponent);
        sut = fixture.componentInstance;
        sut.field = new GroupField({
            key: 'key',
            fields: [
                new HiddenField({ key: 'hiddenFieldKey' })
            ]
        }, new DynamicFormService());
        sut.control = new FormGroup({});
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
