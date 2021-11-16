import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DynamicFormComponent } from '../../../../src/app/features/dynamic-form/dynamic-form.component';

describe('app/features/dynamic-form/DynamicFormComponent', () => {
    let sut: DynamicFormComponent;
    let fixture: ComponentFixture<DynamicFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [DynamicFormComponent]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DynamicFormComponent);
        sut = fixture.componentInstance;
        sut.form = new FormGroup({ id: new FormControl() });
        fixture.detectChanges();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
