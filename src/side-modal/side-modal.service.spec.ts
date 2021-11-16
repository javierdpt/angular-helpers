import { ApplicationRef, ComponentRef, Injector, ViewContainerRef } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { SideModalConfig } from '../../../../src/app/features/side-modal/side-modal.model';
import { SideModalService } from '../../../../src/app/features/side-modal/side-modal.service';
import { TestUtils } from '../../../core/tests-utils.model.spec';

describe('app/features/SideModalService', () => {
    let sut: SideModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                SideModalService,
                TestUtils.getMockedValueProvider(ApplicationRef, null, {
                    components: [{
                        injector: TestUtils.createSpyObj(Injector, {
                            get: TestUtils.createSpyObj(ViewContainerRef, {
                                createComponent: TestUtils.createSpyObj(ComponentRef, null, {
                                    instance: {} as any
                                })
                            })
                        })
                    } as unknown as ComponentRef<any>]
                })
            ]
        });
        sut = TestBed.inject(SideModalService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#open', () => {
        it('should set options.configs.viewContainerRef to global viewRef', () => {
            // arrange
            const configs = {} as SideModalConfig;
            const appGlobalViewContainerRef = TestBed.inject(ApplicationRef).components[0].injector.get(ViewContainerRef);

            // act
            sut.open({
                componentType: {} as any,
                configs
            });

            // assert
            expect(configs.viewContainerRef).toBe(appGlobalViewContainerRef);
        });

        it('should return value with sideModalComponentRef initialized', () => {
            // arrange
            const configs = {} as SideModalConfig;
            const viewRef = TestUtils.createSpyObj(ViewContainerRef, {
                createComponent: TestUtils.createSpyObj(ComponentRef, null, {
                    instance: {} as any
                })
            });
            configs.viewContainerRef = viewRef;

            // act
            const res = sut.open({
                componentType: {} as any,
                configs
            });

            // assert
            expect(res.sideModalComponentRef).toBeDefined();
        });
    });

    describe('#viewContRefHideScrollBars', () => {
        it('should not brake if configs.viewContainerRef is not defined', () => {
            // arrange

            // act
            const act = (): void => sut.viewContRefHideScrollBars({} as any);

            // assert
            expect(act).not.toThrow();
        });

        it('should not brake if configs.viewContainerRef.element is not defined', () => {
            // arrange

            // act
            const act = (): void => sut.viewContRefHideScrollBars({ viewContainerRef: { element: null } } as any);

            // assert
            expect(act).not.toThrow();
        });

        it('should not brake if configs.viewContainerRef.element.nativeElement is not defined', () => {
            // arrange

            // act
            const act = (): void => sut.viewContRefHideScrollBars({ viewContainerRef: { element: { nativeElement: null } } } as any);

            // assert
            expect(act).not.toThrow();
        });

        it('should not brake if configs.viewContainerRef.element.nativeElement.parentElement is not defined', () => {
            // arrange

            // act
            const act = (): void => sut.viewContRefHideScrollBars(
                { viewContainerRef: { element: { nativeElement: { parentElement: null } } } } as any);

            // assert
            expect(act).not.toThrow();
        });

        it('should set parentElement overflow to hidden and after 700ms changed to currentValue', fakeAsync(() => {
            // arrange
            const config = {
                viewContainerRef: {
                    element: { nativeElement: { parentElement: { style: { overflow: 'initial' } } } }
                }
            } as any;

            // act
            sut.viewContRefHideScrollBars(config, 500);

            // assert
            tick(200);
            expect(config.viewContainerRef.element.nativeElement.parentElement.style.overflow).toBe('hidden');
            tick(550);
            expect(config.viewContainerRef.element.nativeElement.parentElement.style.overflow).toBe('initial');
        }));
    });
});
