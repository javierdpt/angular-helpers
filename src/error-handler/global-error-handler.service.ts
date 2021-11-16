import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationRef, ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, timer } from 'rxjs';
import { filter, map, pairwise, throttle } from 'rxjs/operators';
import { StatusCodeException } from '../models/exceptions.model';
import { ENVIRONMENT } from './environment-ref.service';
import { LoggerService } from './logger.service';
import { MonitoringService } from './monitor.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
    error$: BehaviorSubject<HttpErrorResponse | Error | null>;
    throttleTime = 1000;
    errCounter = 0;

    private _cname = 'GlobalErrHandler';
    private _forceLogs = false;

    private _errsToCatch: string[] = [
        // Errors to catch string token defined here
    ];
    set errsToCatch(errors: string[]) {
        this._errsToCatch.push(...errors);
    }

    constructor(private _injector: Injector) {
        this.error$ = new BehaviorSubject<HttpErrorResponse | Error | null>(null);
        this._setUpLogError();
    }

    /**
     * Handles error
     *
     * @param error The types of the error is HttpErrorResponse | Error
     * The error is unwrapped do to the config __zone_symbol__DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION
     * is being set to true, for more info check file src\app\shared\polyfills\zone-configs-override.polyfills.ts
     * and imported in src\polyfills.ts
     */
    handleError(error: HttpErrorResponse | Error): void {
        ++this.errCounter;
        this.error$.next(error);

        if (!this._shouldCatch(error)) {
            this.handle(error);
        } else {
            this.catchError(error);
        }

        this._logErrorCounter();
    }

    handle(error: HttpErrorResponse | Error | StatusCodeException): void {
        const forceLog = !this._injector.get(ENVIRONMENT).production || this._forceLogs;
        const logger = this._injector.get(LoggerService);
        logger.initGroupCollapsed('error', `${this._cname}: Something bad happened (${this.errCounter})`, forceLog);
        logger.logError('error', error, forceLog);
        error instanceof HttpErrorResponse && logger.logHttpErrorResponse('error', error, forceLog);
        logger.groupClose('error', forceLog);

        this._injector.get(MatDialog).closeAll();

        let errorCode = 500;
        if (error instanceof HttpErrorResponse) {
            // Supported error codes stored in page-error.const.ts file
            switch (error.status) {
                case 400:
                case 401:
                case 403:
                case 404:
                case 503: errorCode = error.status;
            }
        }

        if (error instanceof StatusCodeException) { errorCode = error.statusCode; }

        if (error instanceof HttpErrorResponse || error instanceof TypeError || error instanceof StatusCodeException) {
            this._injector
                .get(Router)
                .navigate(
                    ['error', errorCode],
                    { queryParamsHandling: 'merge' }
                );
        }

        // Code block to stop same error to be thrown multiple times
        if (error instanceof HttpErrorResponse || this.errCounter % 3 === 0) {
            this._runInTheZone(() => { });
        }
    }

    catchError(error: HttpErrorResponse | Error): void {
        const forceLog = !this._injector.get(ENVIRONMENT).production || this._forceLogs;
        const logger = this._injector.get(LoggerService);
        logger.initGroupCollapsed('error', `${this._cname}: Error caught (${this.errCounter})`, forceLog);
        logger.logInfo('error', error, forceLog);
        error instanceof HttpErrorResponse && logger.logHttpErrorResponse('error', error, forceLog);
        logger.groupClose('error', forceLog);
    }

    getErrorInfo(
        error: HttpErrorResponse | Error | null
    ): { message: string; exception: string } | null {
        if (!error) { return null; }
        try {
            return {
                message: error instanceof HttpErrorResponse || error instanceof Error
                    ? error.message
                    : 'Unknown error',
                exception: error instanceof HttpErrorResponse
                    ? error.error
                    : error instanceof Error
                        ? (error as Error).stack
                        : (error as any).toString()
            };
        } catch (e: any) {
            return {
                message: 'Unknown error',
                exception: e.toString()
            };
        }
    }

    private _logErrorCounter(): void {
        if (this._injector.get(ENVIRONMENT).production) { return; }
        this._injector.get(LoggerService).displayLoggedItems(this.errCounter, 'error');
    }

    private _setUpLogError(): void {
        this.error$
            .pipe(
                pairwise(),
                throttle(() => timer(this.throttleTime)),
                map(([prevError, currError]) => ({
                    prev: this.getErrorInfo(prevError),
                    curr: this.getErrorInfo(currError)
                })),
                filter((errors: {
                    prev: {
                        message: string;
                        exception: string;
                    } | null;
                    curr: {
                        message: string;
                        exception: string;
                    } | null;
                }) => !!errors.curr && errors.prev?.message !== errors.curr.message &&
                    errors.prev?.exception !== errors.curr.exception
                ),
                map((errors: {
                    prev: { message: string; exception: string } | null;
                    curr: { message: string; exception: string } | null;
                }) => errors.curr)
            )
            .subscribe((error: {
                message: string;
                exception: string;
            } | null) => {
                // Custom error notifiers here

                // Microsoft ApplicationInsights
                this._injector.get(MonitoringService).trackException({
                    error: { name: 'GlobalErrHandlerError', message: error!.message ?? '', stack: error!.exception },
                });
            });
    }

    private _runInTheZone(func: () => void, delay: number = 100): void {
        this._injector
            .get(NgZone)
            .run(() => {
                func();
                timer(delay).subscribe(() => {
                    this._injector.get(ApplicationRef).tick();
                });
            });
    }

    private _shouldCatch(error: HttpErrorResponse | Error | any): boolean {
        const errorMsg = this.getErrorInfo(error)?.message;
        if (!errorMsg) { return false; }
        return this._errsToCatch.some((item: string) => errorMsg!.includes(item));
    }
}
