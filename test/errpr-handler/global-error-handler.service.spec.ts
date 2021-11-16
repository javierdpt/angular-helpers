import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, NgZone } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ENVIRONMENT } from '../../../src/app/core/environment-ref.service';
import { GlobalErrorHandler } from '../../../src/app/core/global-error-handler.service';
import { LoggerService } from '../../../src/app/core/logger.service';
import { MonitoringService } from '../../../src/app/core/monitor.service';
import { NotFoundException } from '../../../src/app/models/exceptions.model';
import { AngularCoreMocks } from '../../core/angular-core-stubs.model.spec';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/GlobalErrorHandler', () => {
    let sut: GlobalErrorHandler;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getMockedValueProvider(MatDialog, ['closeAll']),
                TestUtils.getMockedValueProvider(MonitoringService, ['trackException']),
                AngularCoreMocks.getRouterProvider(),
                TestUtils.getMockedValueProvider(
                    LoggerService,
                    ['log', 'logError', 'logInfo', 'initGroupCollapsed', 'groupClose', 'displayLoggedItems', 'logHttpErrorResponse']
                )
            ]
        });
        sut = TestBed.inject(GlobalErrorHandler);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#constructor', () => {
        it('should initialize error$', () => {
            // arrange

            // act
            const res = sut.error$;

            // assert
            expect(res).toBeDefined();
        });
    });

    describe('#_setUpLogError', () => {
        it('should call MonitorService trackException', fakeAsync(() => {
            // arrange
            const monitoringServiceStub = TestBed.inject(MonitoringService);
            sut.throttleTime = 50;

            // act
            sut.error$.next(new Error('Something bad happened!'));
            tick(100);

            // assert
            expect(monitoringServiceStub.trackException).toHaveBeenCalled();
        }));

        it('should call MonitorService trackException one once', fakeAsync(() => {
            // arrange
            const monitoringServiceStub = TestBed.inject(MonitoringService) as jasmine.SpyObj<MonitoringService>;
            sut.throttleTime = 50;

            // act
            sut.error$.next({ message: 'Something bad happened!', stack: 'stack' } as Error);
            tick(100);
            sut.error$.next({ message: 'Something bad happened!', stack: 'stack' } as Error);
            tick(100);

            // assert
            expect(monitoringServiceStub.trackException.calls.count()).toBe(1);
        }));

        it('should call MonitorService trackException one twice if stackTrace is different', fakeAsync(() => {
            // arrange
            const monitoringServiceStub = TestBed.inject(MonitoringService) as jasmine.SpyObj<MonitoringService>;
            sut.throttleTime = 50;
            const error1 = new Error('Something bad happened 1!');
            (error1 as any).stack = null;
            const error2 = new Error('Something bad happened 2!');
            error2.stack = 'StackTrace...';

            // act
            sut.error$.next(error1);
            tick(100);
            sut.error$.next(error2);
            tick(100);

            // assert
            expect(monitoringServiceStub.trackException.calls.count()).toBe(2);
        }));

        it('should call MonitorService.trackException one three times with a throttle time of 300 and called 5 times', fakeAsync(() => {
            // arrange
            const monitoringServiceStub = TestBed.inject(MonitoringService) as jasmine.SpyObj<MonitoringService>;
            sut.throttleTime = 300;

            // act
            sut.error$.next(new Error('called 1'));
            tick(100);
            sut.error$.next(new Error('ignored 1'));
            tick(50);
            sut.error$.next(new Error('ignored 2'));
            tick(200);
            sut.error$.next(new Error('called 2'));
            tick(333);
            sut.error$.next(new Error('called 3'));

            // assert
            expect(monitoringServiceStub.trackException.calls.count()).toBe(3);
            tick(333);
        }));

        it('should call MonitorService.trackException with a empty message if error.message is null', fakeAsync(() => {
            // arrange
            const monitoringServiceStub = TestBed.inject(MonitoringService) as jasmine.SpyObj<MonitoringService>;
            sut.throttleTime = 50;
            const error = new Error(undefined);
            (error as any).message = null;
            error.stack = 'StackTrace...';

            // act
            sut.error$.next(error);
            tick(100);

            // assert
            expect(monitoringServiceStub.trackException.calls.mostRecent().args[0].error!.message).toBe('');
        }));
    });

    describe('#handleError', () => {
        it('should call error$.next with the error', () => {
            // arrange
            const error = new Error('Something bad happened!');
            const error$NextSpy = spyOn(sut.error$, 'next');

            // act
            sut.handleError(error);

            // assert
            expect(error$NextSpy).toHaveBeenCalledWith(error);
        });

        it('should call _logErrorCounter checked by using LoggerService.displayLoggedItems been called', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService);
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = false;

            // act
            sut.handleError(new Error('Something bad happened!'));

            // assert
            expect(loggerServiceStub.displayLoggedItems).toHaveBeenCalled();
        });

        it('should call handle', () => {
            // arrange
            const handleSpy = spyOn(sut, 'handle');

            // act
            sut.handleError(new Error('Something bad happened!'));

            // assert
            expect(handleSpy).toHaveBeenCalled();
        });

        it('should call catchError', () => {
            // arrange
            sut.errsToCatch = ['bad happened'];
            const catchErrorSpy = spyOn(sut, 'catchError');

            // act
            sut.handleError(new Error('Something bad happened!'));

            // assert
            expect(catchErrorSpy).toHaveBeenCalled();
        });
    });

    describe('#_shouldCatch', () => {
        it('should catch the error', () => {
            // arrange
            sut.errsToCatch = ['error'];
            const catchErrorSpy = spyOn(sut, 'catchError');

            // act
            sut.handleError(new Error('An error happened!'));

            // assert
            expect(catchErrorSpy).toHaveBeenCalled();
        });

        it('should not catch the error', () => {
            // arrange
            sut.errsToCatch = ['Hello from an error :)'];
            const handleSpy = spyOn(sut, 'handle');

            // act
            sut.handleError(new Error('Something bad happened!'));

            // assert
            expect(handleSpy).toHaveBeenCalled();
        });

        it('should not catch the error is error does not have a message', () => {
            // arrange
            const handleSpy = spyOn(sut, 'handle');

            // act
            sut.handleError(null as any);

            // assert
            expect(handleSpy).toHaveBeenCalled();
        });
    });

    describe('#handle', () => {
        it('should call from the logger to initGroupCollapsed, logError and groupClose', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.handle(new Error('Something bad happened!'));

            // assert
            expect(loggerServiceStub.initGroupCollapsed).toHaveBeenCalled();
            expect(loggerServiceStub.logError).toHaveBeenCalled();
            expect(loggerServiceStub.groupClose).toHaveBeenCalled();
        });

        it('should call from the logger to logHttpErrorResponse when is HttpErrorResponse', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.handle(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logHttpErrorResponse).toHaveBeenCalled();
        });

        it('should force the logs', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = false;

            // act
            sut.handle(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logError.calls.mostRecent().args[2]).toBeTrue();
        });

        it('should not force the logs', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = true;

            // act
            sut.handle(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logError.calls.mostRecent().args[2]).toBeFalse();
        });

        it('should call MatDialog.closeAll', () => {
            // arrange
            const matDialogStub = TestBed.inject(MatDialog);

            // act
            sut.handle(new Error());

            // assert
            expect(matDialogStub.closeAll).toHaveBeenCalled();
        });

        it('should redirect to "error/400"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 400 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 400],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/401"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 401 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 401],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/403"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 403 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 403],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/404"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 404 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 404],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/500"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 415 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 500],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/503"', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new HttpErrorResponse({ status: 503 }));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 503],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/500" when error is TypeError', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new TypeError('Something bad happened!'));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 500],
                { queryParamsHandling: 'merge' }
            );
        });

        it('should redirect to "error/404" when is NotFoundException', () => {
            // arrange
            const routerStub = TestBed.inject(Router) as jasmine.SpyObj<Router>;

            // act
            sut.handle(new NotFoundException('Error message'));

            // assert
            expect(routerStub.navigate).toHaveBeenCalledWith(
                ['error', 404],
                { queryParamsHandling: 'merge' }
            );
        });
    });

    describe('#catchError', () => {
        beforeEach(() => {
            sut.errsToCatch = ['bad happened'];
        });

        it('should call from the logger to initGroupCollapsed, logInfo and groupClose', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.catchError(new Error('Something bad happened!'));

            // assert
            expect(loggerServiceStub.initGroupCollapsed).toHaveBeenCalled();
            expect(loggerServiceStub.logInfo).toHaveBeenCalled();
            expect(loggerServiceStub.groupClose).toHaveBeenCalled();
        });

        it('should call from the logger to logHttpErrorResponse when is HttpErrorResponse', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.catchError(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logHttpErrorResponse).toHaveBeenCalled();
        });

        it('should force the logs', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = false;

            // act
            sut.catchError(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logInfo.calls.mostRecent().args[2]).toBeTrue();
        });

        it('should not force the logs', () => {
            // arrange
            const loggerServiceStub = TestBed.inject(LoggerService) as jasmine.SpyObj<LoggerService>;
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = true;

            // act
            sut.catchError(new HttpErrorResponse({ error: 'Something bad happened!' }));

            // assert
            expect(loggerServiceStub.logInfo.calls.mostRecent().args[2]).toBeFalse();
        });
    });

    describe('#_logErrorCounter', () => {
        it('should call displayLoggedItems when production=false', () => {
            // arrange
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = false;
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.handleError(new Error());

            // assert
            expect(loggerServiceStub.displayLoggedItems).toHaveBeenCalled();
        });

        it('should not call displayLoggedItems when production=true', () => {
            // arrange
            const environmentRefStub = TestBed.inject(ENVIRONMENT);
            (environmentRefStub as any).production = true;
            const loggerServiceStub = TestBed.inject(LoggerService);

            // act
            sut.handleError(new Error());

            // assert
            expect(loggerServiceStub.displayLoggedItems).not.toHaveBeenCalled();
        });
    });

    describe('#getErrorInfo', () => {
        it('should return null when error is not defined', () => {
            // arrange

            // act
            const res = sut.getErrorInfo(null);

            // assert
            expect(res).toBeNull();
        });

        it('should return "Unknown error when throwing an exception while returning the response"', () => {
            // arrange
            class CustomError extends Error {
                get message(): string {
                    throw new Error('Error msg');
                }
            }

            // act
            const res = sut.getErrorInfo(new CustomError());

            // assert
            expect(res).toEqual({
                message: 'Unknown error',
                exception: 'Error: Error msg'
            });
        });

        it('should return Unknown Error for message when is neither HttpErrorResponse nor Error', () => {
            // arrange

            // act
            const res = sut.getErrorInfo({} as any);

            // assert
            expect(res?.message).toBe('Unknown error');
        });

        it('should return HttpErrorResponse.error as exception for HttpErrorResponse', () => {
            // arrange

            // act
            const res = sut.getErrorInfo(new HttpErrorResponse({ error: 'Http error happened!' }));

            // assert
            expect(res?.exception).toBe('Http error happened!');
        });

        it('should return stack as exception for Error', () => {
            // arrange
            const error = new Error();
            error.stack = 'Error stacktrace';

            // act
            const res = sut.getErrorInfo(error);

            // assert
            expect(res?.exception).toBe('Error stacktrace');
        });
    });

    describe('#_runInTheZone', () => {
        it('should call NgZone run if error type is HttpErrorResponse', () => {
            // arrange
            const ngZone = TestBed.inject(NgZone) as jasmine.SpyObj<NgZone>;
            spyOn(ngZone, 'run').and.callThrough();

            // act
            sut.handle(new HttpErrorResponse({}));

            // assert
            expect(ngZone.run).toHaveBeenCalled();
        });

        it('should call NgZone run if error counter is multiple of 3', () => {
            // arrange
            const ngZone = TestBed.inject(NgZone) as jasmine.SpyObj<NgZone>;
            spyOn(ngZone, 'run').and.callThrough();
            sut.errCounter = 5;

            // act
            sut.handleError(new Error());

            // assert
            expect(ngZone.run).toHaveBeenCalled();
        });

        it('should call ApplicationRef.tick', fakeAsync(() => {
            // arrange
            const appRef = TestBed.inject(ApplicationRef) as jasmine.SpyObj<ApplicationRef>;
            spyOn(appRef, 'tick').and.callThrough();
            sut.errCounter = 5;

            // act
            sut.handle(new HttpErrorResponse({}));
            tick(150);

            // assert
            expect(appRef.tick).toHaveBeenCalled();
        }));
    });
});
