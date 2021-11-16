import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DynamicFilterDataService } from '../../../../src/app/features/dynamic-filter/dynamic-filter-data.service';
import { DynamicFilterComponent } from '../../../../src/app/features/dynamic-filter/dynamic-filter.component';
import { IFilterData, ISearchTerms } from '../../../../src/app/features/dynamic-filter/dynamic-filter.model';
import { SharedModule } from '../../../../src/app/shared/shared.module';
import { AngularCoreMocks } from '../../../core/angular-core-stubs.model.spec';

describe('app/features/dynamic-filter/DynamicFilterComponent', () => {
    const init = (): any => {
        const fixture: ComponentFixture<DynamicFilterComponent> = TestBed.createComponent(DynamicFilterComponent);
        const componentInstance: DynamicFilterComponent = fixture.componentInstance;
        fixture.detectChanges();
        return { fixture, componentInstance };
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                FormsModule,
                SharedModule
            ],
            declarations: [DynamicFilterComponent],
            providers: [
                AngularCoreMocks.getRouterProvider()
            ]
        }).compileComponents();
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        const sut = init().componentInstance;
        expect(sut).toBeTruthy();
    });

    describe('#constructor', () => {
        let filterDataService: DynamicFilterDataService;

        beforeEach(() => {
            // Reset filterDataCached value
            localStorage.clear();
            filterDataService = TestBed.inject(DynamicFilterDataService);
            filterDataService.get();
        });

        it('should initialize displayed true from filterData service', () => {
            // arrange
            filterDataService.set((fi: IFilterData) => fi.displayed = true);

            // act
            const sut = init().componentInstance;

            // assert
            expect(sut.displayed).toBeTrue();
        });

        it('should initialize displayed false from filterData service', () => {
            // arrange
            filterDataService.set((fi: IFilterData) => fi.displayed = false);

            // act
            const sut = init().componentInstance;

            // assert
            expect(sut.displayed).toBeFalse();
        });

        it('should initialize terms with filterData service terms value', () => {
            // arrange
            const terms: ISearchTerms = { global: 'Test search', specifics: {} };
            filterDataService.set((fi: IFilterData) => fi.terms = terms);
            const sut = init().componentInstance;

            // act
            const res = JSON.stringify(sut.terms.getValue());

            // assert
            expect(res).toBe(JSON.stringify(terms));
        });

        it('should initialize _globalTerm', () => {
            // arrange
            const terms: ISearchTerms = { global: 'Test search', specifics: {} };
            filterDataService.set((fi: IFilterData) => fi.terms = terms);

            // act
            const sut = init().componentInstance;

            // assert
            expect(sut.globalTerm).toBe(terms.global);
        });

        it('#_initGlobal should not throw for null terms', () => {
            // arrange
            filterDataService.set((_itm: IFilterData) => _itm = null as any);

            // act
            const sut = (): void => {
                (init().componentInstance as any)
                    ._initGlobal({ terms: null });
            };

            // assert
            expect(sut).not.toThrow();
        });
    });

    describe('#set globalTerm', () => {
        let sut: DynamicFilterComponent;
        beforeEach(() => {
            sut = init().componentInstance;
        });

        it('should store _globalTerm and call #persisData', () => {
            // arrange
            const persistentDataSpy = spyOn(sut, 'persistData').and.callFake(() => { });
            const globalTermStr = 'Global term';

            // act
            sut.globalTerm = globalTermStr;

            // assert
            expect(sut.globalTerm).toBe(globalTermStr);
            expect(persistentDataSpy).toHaveBeenCalled();
        });

        it('should call terms.next', () => {
            // arrange
            const termsNextSpy = spyOn(sut.terms, 'next');
            sut.persistSearchedItems = false;

            // act
            sut.globalTerm = 'term';

            // assert
            expect(termsNextSpy).toHaveBeenCalled();
        });
    });

    describe('#toggleDisplay', () => {
        let sut: DynamicFilterComponent;
        beforeEach(() => {
            sut = init().componentInstance;
        });

        it('should convert displayed to true from false', () => {
            // arrange
            sut.displayed = false;

            // act
            sut.toggleDisplay();

            // assert
            expect(sut.displayed).toBeTrue();
        });

        it('should convert call #persisData', () => {
            // arrange
            const persistentDataSpy = spyOn(sut, 'persistData').and.callFake(() => { });

            // act
            sut.toggleDisplay();

            // assert
            expect(persistentDataSpy).toHaveBeenCalled();
        });

        it('should reset terms if display is false', () => {
            // arrange
            const filterDataService = TestBed.inject(DynamicFilterDataService);
            sut.displayed = true;

            // act
            sut.toggleDisplay();

            // assert
            expect(filterDataService.get()).toEqual({
                displayed: false,
                terms: { global: null, specifics: {} }
            });
        });
    });

    describe('#persistData', () => {
        let sut: DynamicFilterComponent;
        beforeEach(() => {
            sut = init().componentInstance;
        });

        it('should call filterDataService #set', () => {
            // arrange
            const filterDataService = TestBed.inject(DynamicFilterDataService);
            const filterDataSetSpy = spyOn(filterDataService, 'set').and.callFake(() => { });

            // act
            sut.persistData(() => { });

            // assert
            expect(filterDataSetSpy).toHaveBeenCalled();
        });

        it('should call terms #next', () => {
            // arrange
            const termsNextSpy = spyOn(sut.terms, 'next').and.callFake(() => { });

            // act
            sut.persistData(() => { });

            // assert
            expect(termsNextSpy).toHaveBeenCalled();
        });
    });

    describe('#clean', () => {
        let sut: DynamicFilterComponent;
        beforeEach(() => {
            const filterDataService = TestBed.inject(DynamicFilterDataService);
            filterDataService.get();
            filterDataService.set((fi: IFilterData) => fi.terms.global = 'Global term');
            sut = init().componentInstance;
        });

        it('should set globalTerm to empty', () => {
            // arrange

            // act
            sut.clean();

            // assert
            expect(sut.globalTerm).toBeFalsy();
        });

        it('should call searchInput.nativeElement #focus', () => {
            // arrange
            !sut.searchInput && ((sut.searchInput as any) = {
                nativeElement: {
                    focus: (): void => { }
                }
            });
            const spy = spyOn(sut.searchInput.nativeElement, 'focus').and.callFake(() => { });

            // act
            sut.clean();

            // assert
            expect(spy).toHaveBeenCalled();
        });

        it('should not throw error when searchInput is not defined', () => {
            // arrange
            sut.searchInput = undefined as any;

            // act
            const act = (): void => sut.clean();

            // assert
            expect(act).not.toThrow();
        });
    });

    describe('#ngOnInit', () => {
        let sut: DynamicFilterComponent;
        beforeEach(() => {
            sut = init().componentInstance;
        });

        it('should set displayed to true by default when persistSearchedItems is false', () => {
            // arrange
            sut.persistSearchedItems = false;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.displayed).toBeTrue();
        });

        it('should set displayed to true when alwaysVisible is true', () => {
            // arrange
            sut.alwaysVisible = true;

            // act
            sut.ngOnInit();

            // assert
            expect(sut.displayed).toBeTrue();
        });
    });
});
