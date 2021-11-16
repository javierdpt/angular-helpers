import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT } from '../../../src/app/core/environment-ref.service';
import { CONSOLE, WINDOW } from '../../../src/app/core/injection-token.service';
import { ErrorLevelEnum } from '../../../src/app/core/logger.model';
import { LoggerService } from '../../../src/app/core/logger.service';
import { UtilsService } from '../../../src/app/core/utils.service';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/LoggerService', () => {
    let sut: LoggerService;
    let consoleRefStub: jasmine.SpyObj<Console>;
    let utilsServiceStub: jasmine.SpyObj<UtilsService>;

    let traceEnabledCacheKey: string;
    let traceLevelCacheKey: string;
    let traceGroupedCacheKey: string;

    const setSessionStorageValues = (
        traceEnabled: 'enabled' | 'disabled',
        traceGrouped: 'true' | 'false',
        traceLevel: 'unknown' | 'debug' | 'info' | 'warn' | 'error'
    ): void => {
        sessionStorage.setItem(traceEnabledCacheKey, traceEnabled);
        sessionStorage.setItem(traceGroupedCacheKey, traceGrouped);
        sessionStorage.setItem(traceLevelCacheKey, traceLevel);
    };

    beforeEach(() => {
        sessionStorage.clear();

        TestBed.configureTestingModule({
            providers: [
                TestUtils.getValueProvider(WINDOW, {} as Window),
                TestUtils.getMockedValueProvider(UtilsService,
                    ['getUrlParameter', 'centerText', 'padText']
                ),
                TestUtils.getMockedValueProvider(
                    CONSOLE,
                    ['log', 'error', 'info', 'group', 'groupCollapsed', 'groupEnd']
                ),
                TestUtils.getMockedValueProvider(
                    DOCUMENT,
                    { getElementById: undefined, createElement: { style: {} } as HTMLElement },
                    {
                        head: jasmine.createSpyObj(['appendChild']),
                        body: jasmine.createSpyObj(['appendChild', 'append', 'removeChild'])
                    }
                )
            ]
        });
        sut = TestBed.inject(LoggerService);
        consoleRefStub = TestUtils.inject(CONSOLE);
        utilsServiceStub = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;

        traceEnabledCacheKey = (sut as any)._traceEnabledCacheKey;
        traceLevelCacheKey = (sut as any)._traceLevelCacheKey;
        traceGroupedCacheKey = (sut as any)._traceGroupedCacheKey;
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('should register static logger', () => {
        // arrange
        const windowStub = TestBed.inject(WINDOW);

        // act

        // assert
        expect(windowStub.logger).toBeDefined();
        expect(windowStub.logger).toBe(sut);
    });

    describe('#initEnableTracing', () => {
        it('should be disabled', () => {
            // arrange
            utilsServiceStub.getUrlParameter.and.returnValue('');

            // act
            sut.initEnableTracing();

            // assert
            expect(sut.enabled).toBeFalse();
        });

        it('should call the log with trace enable message (3 times log message)', () => {
            // arrange
            setSessionStorageValues('enabled', 'false', 'debug');
            utilsServiceStub.getUrlParameter.and.returnValue('');

            // act
            sut.initEnableTracing();

            // assert
            expect(consoleRefStub.log).toHaveBeenCalledTimes(3);
        });

        it('should default error level to "error" when level is not defined', () => {
            // arrange
            setSessionStorageValues('enabled', 'false', 'unknown');
            utilsServiceStub.getUrlParameter.and.returnValue('');
            utilsServiceStub.centerText.and.callFake((_n, v: string) => v);

            // act
            sut.level = null as any;
            sut.initEnableTracing();

            // assert
            expect((consoleRefStub as jasmine.SpyObj<Console>)
                .log.calls.argsFor(1)
            ).toEqual(['*Trace enabled (error)*']);
        });

        describe('#_enableTrace', () => {
            beforeEach(() => {
                utilsServiceStub.getUrlParameter.and.callFake((v: string) => {
                    switch (v) {
                        case 'enableTracing':
                            return 'true';
                        case 'tracingLevel':
                            return 'info';
                        case 'grouped':
                            return 'true';
                        default:
                            return '';
                    }
                });
            });

            it('should set localStorage in traceEnabledCacheKey to "enabled"', () => {
                // arrange

                // act
                sut.initEnableTracing();

                // assert
                expect(sessionStorage.getItem(traceEnabledCacheKey)).toBe('enabled');
            });

            it('should set localStorage in traceLevelCacheKey to "info"', () => {
                // arrange

                // act
                sut.initEnableTracing();

                // assert
                expect(sessionStorage.getItem(traceLevelCacheKey)).toBe('info');
            });

            it('should set localStorage in traceGroupedCacheKey to "true"', () => {
                // arrange

                // act
                sut.initEnableTracing();

                // assert
                expect(sessionStorage.getItem(traceGroupedCacheKey)).toBe('true');
            });

            it('should default traceLevel to "info" and grouped to "true" if no value is passed', () => {
                // arrange
                utilsServiceStub.getUrlParameter.and.callFake((v: string) => {
                    switch (v) {
                        case 'enableTracing':
                            return 'true';
                        case 'tracingLevel':
                            return undefined as any;
                        case 'grouped':
                            return undefined as any;
                        default:
                            return '';
                    }
                });

                // act
                sut.initEnableTracing();

                // assert
                expect(sessionStorage.getItem(traceLevelCacheKey)).toBe('info');
                expect(sessionStorage.getItem(traceGroupedCacheKey)).toBe('true');
            });


            it('should log 3 msg to the console and init sut "enabled", "grouped" and "level"', () => {
                // arrange

                // act
                sut.initEnableTracing();

                // assert
                expect(consoleRefStub.log).toHaveBeenCalledTimes(3);
                expect(sut.enabled).toBeDefined();
                expect(sut.grouped).toBeDefined();
                expect(sut.level).toBeDefined();
            });
        });

        describe('#_disableTrace', () => {
            it('should remove _traceEnabledCacheKey, _traceGroupedCacheKey and _traceLevelCacheKey" from sessionStorage', () => {
                // arrange
                utilsServiceStub.getUrlParameter.and.callFake((v: string) => {
                    switch (v) {
                        case 'enableTracing':
                            return 'false';
                        default:
                            return '';
                    }
                });
                setSessionStorageValues('enabled', 'true', 'info');

                // act
                sut.initEnableTracing();

                // assert
                expect(sessionStorage.getItem(traceEnabledCacheKey)).toBeNull();
                expect(sessionStorage.getItem(traceGroupedCacheKey)).toBeNull();
                expect(sessionStorage.getItem(traceLevelCacheKey)).toBeNull();
            });
        });
    });

    describe('#sayHi', () => {
        it('should print a message calling 7 times to cons.log', () => {
            // arrange

            // act
            sut.sayHi();

            // assert
            expect(consoleRefStub.log).toHaveBeenCalledTimes(7);
        });
    });

    describe('#trace & #_incrementCount', () => {
        it('should call cons.log with same args', () => {
            // arrange
            const args = ['arg1', 2, { arg: 3 }];

            // act
            sut.trace(...args);

            // assert
            expect(consoleRefStub.log).toHaveBeenCalledWith(...args);
        });

        it('should increment logCount', () => {
            // arrange

            // act
            sut.trace('test');

            // assert
            expect(sut.logCount).toBe(1);
        });

        describe('#_incrementCount', () => {
            it('should call #displayLoggedItems when settings.production is false', () => {
                // arrange
                const envRefService = TestBed.inject(ENVIRONMENT);
                (envRefService as any).production = false;
                const displayLoggedItemsSpy = spyOn(sut, 'displayLoggedItems');

                // act
                sut.trace('test');

                // assert
                expect(displayLoggedItemsSpy).toHaveBeenCalled();
            });

            it('should no call #displayLoggedItems when settings.production is false and log is disabled', () => {
                // arrange
                const envRefService = TestBed.inject(ENVIRONMENT);
                (envRefService as any).production = true;
                const displayLoggedItemsSpy = spyOn(sut, 'displayLoggedItems');
                sut.enabled = false;

                // act
                sut.trace('test');

                // assert
                expect(displayLoggedItemsSpy).not.toHaveBeenCalled();
            });

            it('should call #displayLoggedItems when log is enabled', () => {
                // arrange
                const envRefService = TestBed.inject(ENVIRONMENT);
                const displayLoggedItemsSpy = spyOn(sut, 'displayLoggedItems');
                (envRefService as any).production = true;
                sut.level = ErrorLevelEnum.debug;
                sut.enabled = true;

                // act
                sut.trace('test');

                // assert
                expect(displayLoggedItemsSpy).toHaveBeenCalled();
            });
        });
    });

    describe('#log & _logEnabled & _lg', () => {
        it('should not brake when consoleRef.log is not defined', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.debug;
            delete (consoleRefStub as any).log;

            // act
            const act = (): void => sut.log('info', 'Message to log');

            // assert
            expect(act).not.toThrow();
        });

        it('should increment count when logging', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.info;

            // act
            sut.log('info', 'Message to log');

            // assert
            expect(sut.logCount).toBe(1);
        });

        describe('#_logEnabled', () => {
            it('should not call cons.log when enabled=false and arg.force=false', () => {
                // arrange
                sut.enabled = false;

                // act
                sut.log('info', 'Message to log');

                // assert
                expect(consoleRefStub.log).not.toHaveBeenCalled();
            });

            it('should call cons.log when enabled=false and arg.force=true', () => {
                // arrange
                sut.enabled = false;

                // act
                sut.log('info', 'Message to log', true);

                // assert
                expect(consoleRefStub.log).toHaveBeenCalled();
            });

            it('should cons.log when logLevel="info", enable=true, arg.force=false and arg.level="info"', () => {
                // arrange
                sut.enabled = true;
                sut.level = ErrorLevelEnum.info;

                // act
                sut.log('info', 'Message to log', false);

                // assert
                expect(consoleRefStub.log).toHaveBeenCalled();
            });

            it('should not call cons.log when logLevel="info", enable=true, arg.force=false and arg.level="debug"', () => {
                // arrange
                sut.enabled = true;
                sut.level = ErrorLevelEnum.info;

                // act
                sut.log('debug', 'Message to log', false);

                // assert
                expect(consoleRefStub.log).not.toHaveBeenCalled();
            });

            it('should not call cons.log when logLevel="info", enable=undefined, arg.force=false and arg.level="debug" ' +
                '(sut.enabled defaulted to false)', () => {
                    // arrange
                    sut.enabled = undefined;
                    sut.level = ErrorLevelEnum.info;

                    // act
                    sut.log('debug', 'Message to log', false);

                    // assert
                    expect(consoleRefStub.log).not.toHaveBeenCalled();
                });

            it('should cons.log when logLevel="info", enable=true, arg.force=false and arg.level="error" ' +
                '(sut.level defaulted to "error")', () => {
                    // arrange
                    sut.enabled = true;
                    sut.level = undefined;

                    // act
                    sut.log('error', 'Message to log', false);

                    // assert
                    expect(consoleRefStub.log).toHaveBeenCalled();
                });
        });
    });

    describe('#logInfo', () => {
        it('should not log for enable=false', () => {
            // arrange
            sut.enabled = false;

            // act
            sut.logInfo('info', 'Message to log');

            // assert
            expect(consoleRefStub.info).not.toHaveBeenCalled();
        });

        it('should increment count when logging', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.info;

            // act
            sut.logInfo('info', 'Message to log');

            // assert
            expect(sut.logCount).toBe(1);
        });

        it('should cal cons.info when arg.force=true', () => {
            // arrange

            // act
            sut.logInfo('info', 'Message to log', true);

            // assert
            expect(consoleRefStub.info).toHaveBeenCalled();
        });

        it('should cal cons.log consoleRef.info is not defined and arg.force=true', () => {
            // arrange
            delete (consoleRefStub as any).info;

            // act
            sut.logInfo('info', 'Message to log', true);

            // assert
            expect(consoleRefStub.log).toHaveBeenCalled();
        });
    });

    describe('#logError', () => {
        it('should not log for enable=false', () => {
            // arrange
            sut.enabled = false;

            // act
            sut.logError('info', 'Message to log');

            // assert
            expect(consoleRefStub.error).not.toHaveBeenCalled();
        });

        it('should increment count when logging', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.info;

            // act
            sut.logError('info', 'Message to log');

            // assert
            expect(sut.logCount).toBe(1);
        });

        it('should cal cons.info when arg.force=true', () => {
            // arrange

            // act
            sut.logError('info', 'Message to log', true);

            // assert
            expect(consoleRefStub.error).toHaveBeenCalled();
        });

        it('should cal cons.log consoleRef.error is not defined and arg.force=true', () => {
            // arrange
            delete (consoleRefStub as any).error;

            // act
            sut.logError('info', 'Message to log', true);

            // assert
            expect(consoleRefStub.log).toHaveBeenCalled();
        });
    });

    describe('#logGroup', () => {
        it('should not call #initGroupCollapsed for enable=false', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            sut.enabled = false;

            // act
            sut.logGroup('info', 'log', 'Title', true, false, 'Message to log');

            // assert
            expect(initGroupCollapsedSpy).not.toHaveBeenCalled();
        });

        it('should call #initGroupCollapsed when logEnabled', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            sut.enabled = true;
            sut.level = ErrorLevelEnum.debug;
            sut.grouped = true;

            // act
            sut.logGroup('info', 'log', 'Title', true, false, 'Message to log');

            // assert
            expect(initGroupCollapsedSpy).toHaveBeenCalled();
        });

        it('should call #initGroupCollapsed when logEnabled', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            sut.enabled = true;
            sut.level = ErrorLevelEnum.debug;

            // act
            sut.logGroup('info', 'log', 'Title', true, false, 'Message to log');

            // assert
            expect(initGroupCollapsedSpy).toHaveBeenCalled();
        });

        it('should call #initGroup when logEnabled and arg.groupCollapsed=false', () => {
            // arrange
            const initGroupSpy = spyOn(sut, 'initGroup');
            sut.enabled = true;
            sut.level = ErrorLevelEnum.debug;
            sut.grouped = false;

            // act
            sut.logGroup('info', 'log', 'Title', false, false, 'Message to log');

            // assert
            expect(initGroupSpy).toHaveBeenCalled();
        });

        it('should call #log 2 times', () => {
            // arrange
            sut.grouped = true;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.logGroup('info', 'log', 'Title', true, true, 'Message to log1', 'Message to log2');

            // assert
            expect(logSpy).toHaveBeenCalledTimes(2);
        });

        it('should call #logError 3 times', () => {
            // arrange
            sut.grouped = true;
            const logErrorSpy = spyOn(sut, 'logError');

            // act
            sut.logGroup('info', 'error', 'Title', true, true, 'Message to log1', 'Message to log2', 'Message to log3');

            // assert
            expect(logErrorSpy).toHaveBeenCalledTimes(3);
        });

        it('should call #logInfo 1 times', () => {
            // arrange
            sut.grouped = true;
            const logInfoSpy = spyOn(sut, 'logInfo');

            // act
            sut.logGroup('info', 'info', 'Title', true, true, 'Message to log1');

            // assert
            expect(logInfoSpy).toHaveBeenCalledTimes(1);
        });

        it('should call #logGroupClose 1 times', () => {
            // arrange
            sut.grouped = true;
            const groupCloseSpy = spyOn(sut, 'groupClose');

            // act
            sut.logGroup('info', 'info', 'Title', true, true, 'Message to log1');

            // assert
            expect(groupCloseSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('#logHttpErrorResponse', () => {
        let httpError: HttpErrorResponse;
        beforeEach(() => {
            httpError = new HttpErrorResponse({
                url: 'http://call.url',
                status: 500,
                statusText: 'InternalServerError',
                error: 'Error'
            });
            (httpError as any).message = 'Error message';
        });

        it('should not log if error not defined', () => {
            // arrange
            const logErrorSpy = spyOn(sut, 'logError');

            // act
            sut.logHttpErrorResponse('error', null, true, false);

            // assert
            expect(logErrorSpy).not.toHaveBeenCalled();
        });

        it('should init and close group if arg.group=true with title containing url', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            const groupCloseSpy = spyOn(sut, 'groupClose');

            // act
            sut.logHttpErrorResponse('error', httpError, true, true);

            // assert
            expect(initGroupCollapsedSpy).toHaveBeenCalled();
            expect(initGroupCollapsedSpy.calls.mostRecent().args[1]).toContain(httpError.url!);
            expect(groupCloseSpy).toHaveBeenCalled();
        });

        it('should not init and close group if arg.group=false', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            const groupCloseSpy = spyOn(sut, 'groupClose');

            // act
            sut.logHttpErrorResponse('error', httpError, true, false);

            // assert
            expect(initGroupCollapsedSpy).not.toHaveBeenCalled();
            expect(groupCloseSpy).not.toHaveBeenCalled();
        });

        it('should init group with title containing error.message if arg.error.url is not defined', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            delete (httpError as any).url;

            // act
            sut.logHttpErrorResponse('error', httpError, true, true);

            // assert
            expect(initGroupCollapsedSpy.calls.mostRecent().args[1]).toContain(httpError.message!);
        });

        it('should init group with title containing arg.error if arg.error.url and arg.message are not defined', () => {
            // arrange
            const initGroupCollapsedSpy = spyOn(sut, 'initGroupCollapsed');
            sut.enabled = true;
            sut.level = ErrorLevelEnum.error;

            // act
            sut.logHttpErrorResponse('error', 'Error message');

            // assert
            expect(initGroupCollapsedSpy.calls.mostRecent().args[1]).toContain('Error message');
        });
    });

    describe('#initGroup', () => {
        it('should not call group if log is not enabled', () => {
            // arrange
            sut.enabled = false;
            sut.grouped = true;

            // act
            sut.initGroup('debug', 'Title');

            // assert
            expect(consoleRefStub.group).not.toHaveBeenCalled();
        });

        it('should call group if log is enabled and grouped=true', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.info;
            sut.grouped = true;

            // act
            sut.initGroup('info', 'Title', true);

            // assert
            expect(consoleRefStub.group).toHaveBeenCalled();
        });

        it('should call log if args.force=true and grouped=false', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroup('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log if Console does not have group, args.force=true and grouped=true', () => {
            // arrange
            sut.grouped = true;
            const logSpy = spyOn(sut, 'log');
            delete (consoleRefStub as any).group;

            // act
            sut.initGroup('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log if args.force=true and grouped=false', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroup('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should add dashes if title is less than 50', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroup('info', '', true);

            // assert
            expect(logSpy.calls.mostRecent().args[1]).toContain('-');
        });

        it('should not add dashes if title is greater than 50', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroup('info', 'Title ' + 'a'.repeat(45), true);

            // assert
            expect(logSpy.calls.mostRecent().args[1]).not.toContain('-');
        });
    });

    describe('#initGroupCollapsed', () => {
        it('should not call group if log is not enabled', () => {
            // arrange
            sut.enabled = false;
            sut.grouped = true;

            // act
            sut.initGroupCollapsed('debug', 'Title');

            // assert
            expect(consoleRefStub.groupCollapsed).not.toHaveBeenCalled();
        });

        it('should call group if log is enabled and grouped=true', () => {
            // arrange
            sut.enabled = true;
            sut.level = ErrorLevelEnum.info;
            sut.grouped = true;

            // act
            sut.initGroupCollapsed('info', 'Title', true);

            // assert
            expect(consoleRefStub.groupCollapsed).toHaveBeenCalled();
        });

        it('should call log if args.force=true and grouped=false', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroupCollapsed('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log if Console does not have group, args.force=true and grouped=true', () => {
            // arrange
            sut.grouped = true;
            const logSpy = spyOn(sut, 'log');
            delete (consoleRefStub as any).groupCollapsed;

            // act
            sut.initGroupCollapsed('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log if args.force=true and grouped=false', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroupCollapsed('info', 'Title', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should add dashes if title is less than 50', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroupCollapsed('info', '', true);

            // assert
            expect(logSpy.calls.mostRecent().args[1]).toContain('-');
        });

        it('should not add dashes if title is greater than 50', () => {
            // arrange
            sut.grouped = false;
            const logSpy = spyOn(sut, 'log');

            // act
            sut.initGroupCollapsed('info', 'Title ' + 'a'.repeat(45), true);

            // assert
            expect(logSpy.calls.mostRecent().args[1]).not.toContain('-');
        });
    });

    describe('#groupClose', () => {
        it('should not call groupEnd if log is not enabled', () => {
            // arrange
            sut.enabled = false;
            sut.grouped = true;

            // act
            sut.groupClose('debug');

            // assert
            expect(consoleRefStub.groupEnd).not.toHaveBeenCalled();
        });

        it('should call groupEnd if args.force=true', () => {
            // arrange
            sut.enabled = false;
            sut.grouped = true;

            // act
            sut.groupClose('debug', true);

            // assert
            expect(consoleRefStub.groupEnd).toHaveBeenCalled();
        });

        it('should call log if grouped=false and args.force=true', () => {
            // arrange
            const logSpy = spyOn(sut, 'log');
            sut.enabled = false;
            sut.grouped = false;

            // act
            sut.groupClose('debug', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });

        it('should call log if ConsoleRef.groupEnd is not defined and args.force=true', () => {
            // arrange
            const logSpy = spyOn(sut, 'log');
            sut.grouped = true;
            delete (consoleRefStub as any).groupEnd;

            // act
            sut.groupClose('debug', true);

            // assert
            expect(logSpy).toHaveBeenCalled();
        });
    });

    describe('#displayLoggedItems', () => {
        let docStub: jasmine.SpyObj<Document>;
        let createdElements: HTMLElement[] = [];

        beforeEach(() => {
            docStub = TestBed.inject(DOCUMENT) as jasmine.SpyObj<Document>;
            createdElements = [];
            sut.logCount = 0;
            docStub.createElement.and.callFake((tagName: string) => {
                const elem = {
                    tagName,
                    style: {}
                } as unknown as HTMLElement;
                createdElements.push(elem);
                return elem as HTMLElement;
            });
            sut.displayLoggedErrorsTime = 50;
        });

        it('should create two element one for the style and one for the div#static-log-counter', () => {
            // arrange

            // act
            sut.displayLoggedItems(null, 'error');

            // assert
            expect(docStub.createElement).toHaveBeenCalledTimes(2);
            expect(createdElements.some(e => e.tagName === 'div')).toBeTrue();
            expect(createdElements.some(e => e.tagName === 'style')).toBeTrue();
        });

        it('should not create elements if the are already crated', () => {
            // arrange
            docStub.getElementById.and.returnValue({ style: {} } as HTMLElement);

            // act
            sut.displayLoggedItems(1);

            // assert
            expect(docStub.createElement).not.toHaveBeenCalled();
        });

        it('should set the innerText to the consoleRef.accessedCounter if args.counter not provided', () => {
            // arrange
            sut.logCount = 100;

            // act
            sut.displayLoggedItems(null, 'info');

            // assert
            expect(createdElements.find(e => e.tagName === 'div')?.innerText).toBe('100');
        });

        it('should div.style.backgroundColor="rgba(244, 67, 54, .3)" and div.style.color="rgb(244, 67, 54)" for args.type="error"', () => {
            // arrange
            sut.logCount = 100;

            // act
            sut.displayLoggedItems(null, 'error');

            // assert
            const createdDivElement = createdElements.find(e => e.tagName === 'div');
            expect(createdDivElement?.style.backgroundColor).toBe('rgba(244, 67, 54, .3)');
            expect(createdDivElement?.style.color).toBe('rgb(244, 67, 54)');
        });


        it('should div.style.backgroundColor="rgba(33, 150, 243, .3)" and div.style.color="rgb(33, 150, 243)" for args.type="info"', () => {
            // arrange
            sut.logCount = 100;

            // act
            sut.displayLoggedItems(null, 'info');

            // assert
            const createdDivElement = createdElements.find(e => e.tagName === 'div');
            expect(createdDivElement?.style.backgroundColor).toBe('rgba(33, 150, 243, .3)');
            expect(createdDivElement?.style.color).toBe('rgb(33, 150, 243)');
        });


        it('should div.style.backgroundColor="rgba(0, 0, 0, .3)" and div.style.color="white" for undefined args.type',
            () => {
                // arrange
                sut.logCount = 100;

                // act
                sut.displayLoggedItems(null);

                // assert
                const createdDivElement = createdElements.find(e => e.tagName === 'div');
                expect(createdDivElement?.style.backgroundColor).toBe('rgba(0, 0, 0, .3)');
                expect(createdDivElement?.style.color).toBe('white');
            });

        it('should div.style.backgroundColor="rgba(173, 115, 19, .3)" and div.style.color="rgb(33, 150, 243)" for type="warn"',
            () => {
                // arrange

                // act
                sut.displayLoggedItems(null, 'warn');

                // assert
                const createdDivElement = createdElements.find(e => e.tagName === 'div');
                expect(createdDivElement?.style.backgroundColor).toBe('rgba(173, 115, 19, .3)');
                expect(createdDivElement?.style.color).toBe('rgb(33, 150, 243)');
            });
    });
});
