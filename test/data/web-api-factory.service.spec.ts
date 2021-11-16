/* eslint-disable @typescript-eslint/dot-notation */

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { WebApiFactoryService } from '../../../src/app/data/web-api-factory.service';
import { WebApiRestService } from '../../../src/app/data/web-api-rest-service.model';
import { WebApiService } from '../../../src/app/data/web-api-service.model';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/data/WebApiFactoryService', () => {
    let sut: WebApiFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getMockedValueProvider(HttpClient, ['get'])
            ]
        });
        sut = TestBed.inject(WebApiFactoryService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#getApiInstance', () => {
        it('should return and WebApiService instance', () => {
            // arrange

            // act
            const res = sut.getApiInstance('endpoint');

            // assert
            expect(res).toBeInstanceOf(WebApiService);
        });

        it('when called twice should return same instance of the service', () => {
            // arrange

            // act
            const res1 = sut.getApiInstance('endpoint');
            const res2 = sut.getApiInstance('endpoint');

            // assert
            expect(res1).toBe(res2);
        });
    });

    describe('#getRestInstance', () => {
        it('should return and WebApiRestService instance', () => {
            // arrange

            // act
            const res = sut.getRestInstance<any>('endpoint');

            // assert
            expect(res).toBeInstanceOf(WebApiRestService);
        });

        it('when called twice should return same instance of the service', () => {
            // arrange

            // act
            const res1 = sut.getRestInstance<any>('endpoint');
            const res2 = sut.getRestInstance<any>('endpoint');

            // assert
            expect(res1).toBe(res2);
        });
    });

    describe('#_getInstanceKey', () => {
        it('should return baseApiUrl', () => {
            // arrange

            // act
            const res = sut['_getInstanceKey']('baseApiUrl', 'endpoint');

            // assert
            expect(res).toBe('baseApiUrl/endpoint');
        });
    });
});
