import { TestBed } from '@angular/core/testing';
import dayjs from 'dayjs';
import { StorageLoc } from '../../../src/app/core/cache.model';
import { CacheService } from '../../../src/app/core/cache.service';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/CacheService', () => {
    let sut: CacheService;

    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
        TestBed.configureTestingModule({});
        sut = TestBed.inject(CacheService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#set', () => {
        it('should set an item into localStorage', () => {
            // arrange

            // act
            sut.set(StorageLoc.local, 'item', { hello: 'world!' });

            // assert
            expect(localStorage.getItem('item')).toBeDefined();
        });

        it('should set an item into sessionStorage', () => {
            // arrange

            // act
            sut.set(StorageLoc.session, 'item', { hello: 'world!' });

            // assert
            expect(sessionStorage.getItem('item')).toBeDefined();
        });
    });

    describe('#get', () => {
        it('should return "item" from the storage', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' });

            // act
            const res = sut.get(StorageLoc.session, 'item');

            // assert
            expect(res).toEqual({ hello: 'world!' });
        });

        it('should return "item" from the storage when expiresAt is in the future', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' }, dayjs().add(5, 'minute').toDate());

            // act
            const res = sut.get(StorageLoc.session, 'item');

            // assert
            expect(res).not.toBeNull();
        });

        it('should return null and remove the item from the storage when expired', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' }, dayjs().subtract(5, 'minute').toDate());

            // act
            const res = sut.get(StorageLoc.local, 'item');

            // assert
            expect(res).toBeNull();
            expect(localStorage.getItem('item')).toBeNull();
        });

        it('should parse dates with MsFormat', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' });
            const tempItem = JSON.parse(sessionStorage.getItem('item')!);
            tempItem.createdAt = `/Date(${dayjs().add(5, 'day').toDate().getTime()}+0530)/`;
            sessionStorage.setItem('item', JSON.stringify(tempItem));

            // act
            const res = sut.getInfo(StorageLoc.session, 'item');

            // assert
            expect(res?.createdAt).toBeInstanceOf(Date);
            expect(TestUtils.getFormattedDate(res?.createdAt))
                .toBe(TestUtils.getFormattedDate(dayjs().add(5, 'day')));
        });

        it('should not throw when parse dates with MsFormat does not contains time section', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' });
            const tempItem = JSON.parse(sessionStorage.getItem('item')!);
            tempItem.createdAt = `/Date(-${dayjs().add(5, 'day').toDate().getTime()}+0530)/`;
            sessionStorage.setItem('item', JSON.stringify(tempItem));

            // act
            const act = (): any => sut.getInfo(StorageLoc.session, 'item');

            // assert
            expect(act).not.toThrow();
        });
    });

    describe('#getCacheItem', () => {
        it('should return "item" from the storage', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' });

            // act
            const res = sut.getCacheItem(StorageLoc.session, 'item');

            // assert
            expect(res).toBeDefined();
        });

        it('should return "item" from the storage when expiresAt is in the future', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' }, dayjs().add(5, 'minute').toDate());

            // act
            const res = sut.getCacheItem(StorageLoc.session, 'item');

            // assert
            expect(res).not.toBeNull();
        });

        it('should return null and remove the item from the storage when expired', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' }, dayjs().subtract(5, 'minute').toDate());

            // act
            const res = sut.getCacheItem(StorageLoc.local, 'item');

            // assert
            expect(res).toBeNull();
            expect(localStorage.getItem('item')).toBeNull();
        });
    });

    describe('#getInfo', () => {
        it('should return null when expired', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' }, dayjs().subtract(5, 'minute').toDate());

            // act
            const res = sut.getInfo(StorageLoc.local, 'item');

            // assert
            expect(res).toBeNull();
        });

        it('should return "item" info', () => {
            // arrange
            sut.set(StorageLoc.session, 'item', { hello: 'world!' }, dayjs().add(5, 'minute').toDate());

            // act
            const res = sut.getInfo(StorageLoc.session, 'item');

            // assert
            expect(res).toEqual(jasmine.objectContaining({
                createdAt: jasmine.any(Date),
                expiresAt: jasmine.any(Date)
            }));
        });
    });

    describe('#remove', () => {
        it('should remove item from cache', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' });

            // act
            sut.remove(StorageLoc.local, 'item');

            // assert
            expect(localStorage.getItem('item')).toBeNull();
        });
    });

    describe('#isWithinBuffer', () => {
        it('should return true', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' });

            // act
            const res = sut.isWithinBuffer(StorageLoc.local, 'item', { value: 3, unit: 'minute' });

            // assert
            expect(res).toBeTrue();
        });

        it('should return true', () => {
            // arrange
            sut.set(StorageLoc.local, 'item', { hello: 'world!' }, dayjs().subtract(5, 'minute').toDate());

            // act
            const res = sut.isWithinBuffer(StorageLoc.local, 'item', { value: 3, unit: 'minute' });

            // assert
            expect(res).toBeFalse();
        });
    });
});
