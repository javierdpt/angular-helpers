import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IEnvironmentSettings } from '../../../src/app/core/environment-ref.service';
import { LoggerService } from '../../../src/app/core/logger.service';
import { WebApiFactoryService } from '../../../src/app/data/web-api-factory.service';
import { IRequestOptions, IRequestOptionsRetry, WebApiService } from '../../../src/app/data/web-api-service.model';
import { HttpStatusCodeEnum } from '../../../src/app/models/http-status-codes-enum';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/data/WebApiRestService', () => {
    let factory: WebApiFactoryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getMockedValueProvider(HttpClient, ['get', 'post', 'put', 'delete'])
            ]
        });
        factory = TestBed.inject(WebApiFactoryService);
    });

    it('should be created', () => {
        // arrange

        // act
        const sut = factory.getApiInstance('endpoint');

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#get', () => {
        it('should call HttpClient get', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.get();

            // assert
            expect(httpClientStub.get).toHaveBeenCalled();
        });

        it('should call _retry if retry options is set', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            httpClientStub.get.and.returnValue(of({}));
            const sut = factory.getApiInstance('endpoint');
            const retrySpy = spyOn((sut as any), '_retry').and.callThrough();

            // act
            sut.get(undefined, { retry: { attempts: 1, delayOp: (): Observable<number> => timer(0), statusCodes: [] } });

            // assert
            expect(retrySpy).toHaveBeenCalled();
        });
    });

    describe('#post', () => {
        it('should call HttpClient post', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.post({});

            // assert
            expect(httpClientStub.post).toHaveBeenCalled();
        });

        it('should call _retry if retry options is set', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            httpClientStub.post.and.returnValue(of({}));
            const sut = factory.getApiInstance('endpoint');
            const retrySpy = spyOn((sut as any), '_retry').and.callThrough();

            // act
            sut.post({}, undefined, { retry: { attempts: 1, delayOp: (): Observable<number> => timer(0), statusCodes: [] } });

            // assert
            expect(retrySpy).toHaveBeenCalled();
        });

        it('should call post with a JSON.stringify string if entity is not a FromData', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.post({ id: '12345' });

            // assert
            expect(httpClientStub.post.calls.mostRecent().args[1]).toBeInstanceOf(String);
        });

        it('should call post with a FromData', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.post(new FormData());

            // assert
            expect(httpClientStub.post.calls.mostRecent().args[1]).toBeInstanceOf(FormData);
        });
    });

    describe('#put', () => {
        it('should call HttpClient put', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.put({});

            // assert
            expect(httpClientStub.put).toHaveBeenCalled();
        });

        it('should call _retry if retry options is set', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            httpClientStub.put.and.returnValue(of({}));
            const sut = factory.getApiInstance('endpoint');
            const retrySpy = spyOn((sut as any), '_retry').and.callThrough();

            // act
            sut.put({}, undefined, { retry: { attempts: 1, delayOp: (): Observable<number> => timer(0), statusCodes: [] } });

            // assert
            expect(retrySpy).toHaveBeenCalled();
        });

        it('should call put with a JSON.stringify string if entity is not a FromData', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.put({ id: '12345' });

            // assert
            expect(httpClientStub.put.calls.mostRecent().args[1]).toBeInstanceOf(String);
        });

        it('should call put with a FromData', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.put(new FormData());

            // assert
            expect(httpClientStub.put.calls.mostRecent().args[1]).toBeInstanceOf(FormData);
        });
    });

    describe('#delete', () => {
        it('should call HttpClient delete', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient);
            const sut = factory.getApiInstance('endpoint');

            // act
            sut.delete();

            // assert
            expect(httpClientStub.delete).toHaveBeenCalled();
        });

        it('should call _retry if retry options is set', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            httpClientStub.delete.and.returnValue(of({}));
            const sut = factory.getApiInstance('endpoint');
            const retrySpy = spyOn((sut as any), '_retry').and.callThrough();

            // act
            sut.delete({}, undefined, { retry: { attempts: 1, delayOp: (): Observable<number> => timer(0), statusCodes: [] } });

            // assert
            expect(retrySpy).toHaveBeenCalled();
        });

        it('should set requestOption.body if body is passed', () => {
            // arrange
            const httpClientStub = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
            const sut = factory.getApiInstance('endpoint');
            const body = { id: '12345' };

            // act
            sut.delete(body, undefined);

            // assert
            expect((httpClientStub.delete.calls.mostRecent().args[1] as any).body)
                .toBe(body);
        });
    });

    describe('#_retry', () => {
        let sut: WebApiServiceTest;
        beforeEach(() => {
            sut = new WebApiServiceTest('endpoint');
        });

        it('should retry 3 times and fail', (done: DoneFn) => {
            // arrange
            const callsToDelayOpSpy = jasmine.createSpy();

            // act
            sut.retry(
                {
                    attempts: 3,
                    statusCodes: [HttpStatusCodeEnum.INTERNAL_SERVER_ERROR],
                    delayOp: () => {
                        callsToDelayOpSpy();
                        return timer(0);
                    }
                },
                throwError(new HttpErrorResponse({ status: 500 }))
            ).pipe(
                catchError(() => of(null))
            ).subscribe(() => {
                // assert
                expect(callsToDelayOpSpy).toHaveBeenCalledTimes(3);
                done();
            });
        });

        it('should retry 0 times when the status code is not in the statusCodes param', (done: DoneFn) => {
            // arrange
            const callsToDelayOpSpy = jasmine.createSpy();

            // act
            sut.retry(
                {
                    attempts: 3,
                    statusCodes: [HttpStatusCodeEnum.BAD_REQUEST],
                    delayOp: () => {
                        callsToDelayOpSpy();
                        return timer(0);
                    }
                },
                throwError(new HttpErrorResponse({ status: 404 }))
            ).pipe(
                catchError(() => of(null))
            ).subscribe(() => {
                // assert
                expect(callsToDelayOpSpy).toHaveBeenCalledTimes(0);
                done();
            });
        });
    });

    describe('#_getRequestUrl', () => {
        it('should return "/test/api/path/to/resource" for base="/test/api" and endpoint="path/to/resource"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestUrl('path/to/resource');

            // assert
            expect(res).toBe('/test/api/path/to/resource');
        });

        it('should return "/base/endpoint/path/to/resource" for base="/base/endpoint" and endpoint="path/to/resource"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint', '/base/endpoint');

            // act
            const res = sut.getRequestUrl('path/to/resource');

            // assert
            expect(res).toBe('/base/endpoint/path/to/resource');
        });
    });

    describe('#_joinUrls', () => {
        it('should return "/path1"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.joinUrls('/path1', null);

            // assert
            expect(res).toBe('/path1');
        });

        it('should return "/path1/path2"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.joinUrls('/path1', 'path2');

            // assert
            expect(res).toBe('/path1/path2');
        });

        it('should return "/path2"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.joinUrls('', '/path2');

            // assert
            expect(res).toBe('/path2');
        });
    });

    describe('#_getRequestOptions', () => {
        it('should initialize default values', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions();

            // assert
            expect(res.headers).toBeDefined();
            expect(res.responseType).toBeDefined();
            expect(res.responseType).toBe('json');
        });

        it('should initialize params', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions({
                params: new HttpParams()
            });

            // assert
            expect(res.params).toBeDefined();
        });

        it('should initialize headers with "test-header"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions({
                headers: { 'test-header': 'header' }
            });

            // assert
            expect(res.headers).toBeDefined();
            expect(res.headers.has('test-header')).toBeTrue();
        });

        it('should set header "Content-Type: application/json" for default jsonContentProperty=true"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions();

            // assert
            expect(res.headers.has('Content-Type')).toBeTrue();
        });

        it('should set jsonContentProperty to false"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions({
                jsonContentType: false
            });

            // assert
            expect(res.headers.has('Content-Type')).toBeFalse();
        });

        it('should set responseType to "blob"', () => {
            // arrange
            const sut = new WebApiServiceTest('endpoint');

            // act
            const res = sut.getRequestOptions({
                responseType: 'blob'
            });

            // assert
            expect(res.responseType).toBe('blob');
        });
    });
});

class WebApiServiceTest extends WebApiService {
    constructor(resourceEndPoint: string, baseApiUrl?: string) {
        super(
            {
                apiEndpoint: '/test/api'
            } as IEnvironmentSettings,
            TestUtils.createSpyObj(HttpClient),
            jasmine.createSpyObj<LoggerService>('LoggerService', ['log']) as any, resourceEndPoint, baseApiUrl);
    }

    retry<T>(retryOpt: IRequestOptionsRetry, req: Observable<T>): Observable<T> {
        return this._retry(retryOpt, req);
    }

    getRequestUrl(resourceEndPoint: string): string {
        return this._getRequestUrl(resourceEndPoint);
    }

    joinUrls(
        left: string | null | undefined,
        right: string | null | undefined
    ): string {
        return this._joinUrls(left, right);
    }

    getRequestOptions(options?: IRequestOptions): any {
        return this._getRequestOptions(options);
    }
}
