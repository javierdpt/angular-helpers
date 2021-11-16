import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { WebApiFactoryService } from '../../../src/app/data/web-api-factory.service';
import { WebApiRestService } from '../../../src/app/data/web-api-rest-service.model';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/data/WebApiRestService', () => {
    let apiFactory: WebApiFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getMockedValueProvider(HttpClient, ['get', 'post', 'put'])
            ]
        });
        apiFactory = TestBed.inject(WebApiFactoryService);
    });

    it('should be created', () => {
        // arrange

        // act
        const sut = apiFactory.getRestInstance<any>('endpoint');

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#findAll', () => {
        it('should call HttpClient get with ', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = apiFactory.getRestInstance('endpoint');

            // act
            sut.findAll();

            // assert
            expect(httpClientStub.get).toHaveBeenCalled();
        });
    });

    describe('#findById', () => {
        it('should call get from HttpClient', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = apiFactory.getRestInstance('endpoint');

            // act
            sut.findById('12345', {});

            // assert
            expect(httpClientStub.get).toHaveBeenCalled();
        });
    });

    describe('#save', () => {
        let httpClientStub: jasmine.SpyObj<HttpClient>;
        let sut: WebApiRestService<unknown>;

        beforeEach(() => {
            httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            sut = apiFactory.getRestInstance('endpoint');
        });

        it('should call post when "id" is not present in the entity', () => {
            // arrange

            // act
            sut.save({});

            // assert
            expect(httpClientStub.post).toHaveBeenCalled();
        });

        it('should call put when "id" is present in the entity', () => {
            // arrange

            // act
            sut.save({ id: '12345' });

            // assert
            expect(httpClientStub.put).toHaveBeenCalled();
        });

        it('should call put when "Id" is present in the entity', () => {
            // arrange

            // act
            sut.save({ Id: '12345' });

            // assert
            expect(httpClientStub.put).toHaveBeenCalled();
        });

        it('should call put when "EntityId" is present in the entity and entityIdName is passed', () => {
            // arrange

            // act
            sut.save({ EntityId: '12345' }, 'EntityId');

            // assert
            expect(httpClientStub.put).toHaveBeenCalled();
        });
    });
});
