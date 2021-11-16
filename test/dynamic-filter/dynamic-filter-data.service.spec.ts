import { TestBed } from '@angular/core/testing';
import { StorageLoc } from '../../../../src/app/core/cache.model';
import { CacheService } from '../../../../src/app/core/cache.service';
import { DynamicFilterDataService } from '../../../../src/app/features/dynamic-filter/dynamic-filter-data.service';
import { IFilterData } from '../../../../src/app/features/dynamic-filter/dynamic-filter.model';

describe('app/features/dynamic-filter/DynamicFilterDataService', () => {
    let sut: DynamicFilterDataService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        sut = TestBed.inject(DynamicFilterDataService);
        localStorage.clear();
        sessionStorage.clear();
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#get', () => {
        let cacheService: CacheService;
        const checkEmptyValue = (res: IFilterData) => {
            expect(res.displayed).toBeFalse();
            expect(res.terms.global).toBeNull();
            expect(JSON.stringify(res.terms.specifics)).toBe('{}');
        };

        beforeEach(() => {
            localStorage.clear();
            cacheService = TestBed.inject(CacheService);
            sut.reset();
        });

        it('should return empty value', () => {
            // arrange
            spyOn(sut as any, '_getCurrentPathName').and.returnValue('/test/url');

            // act
            const res = sut.get();

            // assert
            checkEmptyValue(res);
        });

        it('should return empty value and create cache item', () => {
            // arrange
            spyOn(sut as any, '_getCurrentPathName').and.returnValue('/test/url');

            // act
            const res = sut.get();
            const cachedValue = cacheService.get(StorageLoc.local, 'grm-ui-filter-store');

            // assert
            checkEmptyValue(res);
            expect(cachedValue).toBeDefined();
            expect(JSON.stringify(cachedValue)).toBe('{"data":{"/test/url":{"displayed":false,"terms":{"global":null,"specifics":{}}}}}');
        });

        it('should return value from cache', () => {
            // arrange
            spyOn(sut as any, '_getCurrentPathName').and.returnValue('/test/url');
            sut.get();
            sut.set((fi: IFilterData) => {
                fi.displayed = true;
                fi.terms.global = 'SearchValue';
            });

            // act
            const res = sut.get();

            // assert
            expect(res.displayed).toBeTrue();
            expect(res.terms.global).toBe('SearchValue');
        });
    });

    describe('#set', () => {
        it('should call parent class updateClonedReferenceProp', () => {
            // arrange
            const spy = spyOn((sut as any).__proto__, 'updateClonedReferenceProp').and.callFake(() => { });

            // act
            sut.set(() => { });

            // assert
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('#_getDataValSave', () => {
        it('should return empty value when null data', () => {
            // arrange

            // act
            const res = (sut as any)._getDataValSave(null);

            // assert
            expect(res).toEqual({});
        });
    });
});
