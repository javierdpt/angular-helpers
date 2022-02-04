import { ChangeDetectorRef, ComponentFactoryResolver, ComponentRef, ViewContainerRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationStart, Router } from '@angular/router';
import { SideModalComponentAnchorDirective } from '../../../../src/app/features/side-modal/side-modal-component-anchor.directive';
import { SideModalRef } from '../../../../src/app/features/side-modal/side-modal-ref.model';
import { SideModalComponent } from '../../../../src/app/features/side-modal/side-modal.component';
import { SideModalConfig } from '../../../../src/app/features/side-modal/side-modal.model';
import { SideModalService } from '../../../../src/app/features/side-modal/side-modal.service';
import { AngularCoreMocks, RouterStub } from '../../../core/angular-core-stubs.model.spec';
import { TestUtils } from '../../../core/tests-utils.model.spec';

describe('app/features/side-modal/SideModalComponent', () => {
    let sut: SideModalComponent;
    let fixture: ComponentFixture<SideModalComponent>;
    let routerStub: RouterStub;

    beforeEach(async () => {
        routerStub = AngularCoreMocks.getRouterStub();

        await TestBed.configureTestingModule({
            imports: [
                NoopAnimationsModule
            ],
            declarations: [
                SideModalComponent
            ],
            providers: [
                TestUtils.getValueProvider(Router, routerStub.stub),
                TestUtils.getMockedValueProvider(SideModalService, ['viewContRefHideScrollBars']),
                TestUtils.getMockedValueProvider(SideModalRef, ['close', 'opened']),
                TestUtils.getMockedValueProvider(ComponentFactoryResolver, ['resolveComponentFactory'])
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SideModalComponent);
        sut = fixture.componentInstance;
        sut.configs = {
            position: 'right'
        } as SideModalConfig<any>;
        sut.componentType = {} as any;
        sut.sideModalComponentAnchor = TestUtils.createSpyObj(SideModalComponentAnchorDirective, null, {
            viewContainerRef: TestUtils.createSpyObj(ViewContainerRef, {
                createComponent: TestUtils.createSpyObj(ComponentRef, null, {
                    changeDetectorRef: TestUtils.createSpyObj(ChangeDetectorRef, ['detectChanges'])
                })
            })
        });
    });

    it('should create', () => {
        // arrange

        // act
        sut.ngOnInit();

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#constructor', () => {
        it('should init appTheme$', () => {
            // arrange

            // act

            // assert
            expect(sut.appTheme$).toBeDefined();
        });
    });

    describe('#classes', () => {
        it('should return "jd-side-modal custom-class"', () => {
            // arrange

            // act
            sut.configs = { panelClass: 'custom-class' } as SideModalConfig;

            // assert
            expect(sut.classes).toBe('jd-side-modal custom-class');
        });
    });

    describe('#ngOnInit', () => {
        it('should throw error when componentType is not defined', () => {
            // arrange
            sut.componentType = undefined as any;

            // act
            const act = (): void => sut.ngOnInit();

            // assert
            expect(act).toThrow();
        });

        it('should throw error when configs is not defined', () => {
            // arrange
            sut.configs = undefined as any;

            // act
            const act = (): void => sut.ngOnInit();

            // assert
            expect(act).toThrow();
        });
    });

    describe('#_initSideModalContainerStyles', () => {
        it('should init configs.width to "400px" by default', () => {
            // arrange
            sut.configs.width = undefined as any;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.sideModalContainerStyles.width).toBe('400px');
        });

        it('should init configs.width to "500px"', () => {
            // arrange
            sut.configs.width = '500px';

            // act
            sut.ngOnInit();

            // assert
            expect(sut.sideModalContainerStyles.width).toBe('500px');
        });

        it('should init configs.min-width to "500px"', () => {
            // arrange
            sut.configs.minWidth = '500px';

            // act
            sut.ngOnInit();

            // assert
            expect(sut.sideModalContainerStyles['min-width']).toBe('500px');
        });

        it('should init configs.max-width to "500px"', () => {
            // arrange
            sut.configs.maxWidth = '500px';

            // act
            sut.ngOnInit();

            // assert
            expect(sut.sideModalContainerStyles['max-width']).toBe('500px');
        });
    });

    describe('#_setupCloseOnNavigation', () => {
        it('should call sideModalRef.close when this.configs.closeOnNavigation=true and event is NavigationStart', () => {
            // arrange
            const sideModalRefStub = TestBed.inject(SideModalRef);
            sut.configs.closeOnNavigation = true;
            sut.ngOnInit();

            // act
            routerStub.eventsSubj.next(new NavigationStart(1, 'some/url'));

            // assert
            expect(sideModalRefStub.close).toHaveBeenCalled();
        });
    });

    describe('#ngAfterViewInit', () => {
        it('should call sideModalRef.opened', () => {
            // arrange
            const sideModalRefStub = TestBed.inject(SideModalRef);

            // act
            sut.ngAfterViewInit();

            // assert
            expect(sideModalRefStub.opened).toHaveBeenCalled();
        });
    });

    describe('#hide', () => {
        it('should set hidden to true', () => {
            // arrange

            // act
            sut.hide();;

            // assert
            expect(sut.hidden).toBeTrue();
        });
    });
});
