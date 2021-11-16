import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ErrorHandler, Inject, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import dayjs from 'dayjs';
import { Observable } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppAuthService } from '../../core/app-auth.service';
import { AppDataService } from '../../core/app-data.service';
import { AppInitializerService } from '../../core/app-initializer.service';
import { ENVIRONMENT, IEnvironmentSettings } from '../../core/environment-ref.service';
import { GlobalErrorHandler } from '../../core/global-error-handler.service';
import { LoggerService } from '../../core/logger.service';
import { SharerTypes } from '../../core/sharer.model';
import { SharerService } from '../../core/sharer.service';
import { BaseUnsubscribeComponent } from '../../models/base-unsubscribe-component.model';
import { LabelsResourceExistPipe } from '../../shared/pipes/labels-resource-exist.pipe';
import { LabelsResourcesPipe } from '../../shared/pipes/labels-resources.pipe';
import { pageErrors } from './page-error.const';
import { IPageError } from './page-error.model';

@Component({
    selector: 'app-page-error',
    templateUrl: './page-error.component.html',
    styleUrls: ['./page-error.component.scss'],
    animations: []
})
export class PageErrorComponent extends BaseUnsubscribeComponent implements OnInit, OnDestroy {
    isAuthenticated$: Observable<boolean | null>;
    isAppInitialized$: Observable<boolean | null>;
    error: IPageError | undefined;
    errorCode: string | undefined;
    showErrorLog: boolean | undefined;
    logError: any;
    isHttpError: boolean | undefined;
    displayErrorMsg: boolean | undefined;
    private _globalErrorHandler: GlobalErrorHandler;
    private _labelsResourceExist: LabelsResourceExistPipe;
    private _labelsResources: LabelsResourcesPipe;

    constructor(
        errorHandler: ErrorHandler,
        appInit: AppInitializerService,
        appData: AppDataService,
        @Inject(ENVIRONMENT) env: IEnvironmentSettings,
        private readonly _appAuth: AppAuthService,
        private readonly _zone: NgZone,
        private readonly _route: ActivatedRoute,
        private readonly _location: Location,
        private readonly _sharer: SharerService<string>,
        private readonly _logger: LoggerService
    ) {
        super();
        this._globalErrorHandler = errorHandler as GlobalErrorHandler;
        this._labelsResourceExist = new LabelsResourceExistPipe(appData);
        this._labelsResources = new LabelsResourcesPipe(appData, env);
        this.isAuthenticated$ = _appAuth.isAuthenticated$;
        this.isAppInitialized$ = appInit.initialized$;
        this.displayErrorMsg = false;
    }

    ngOnInit(): void {
        this._logger.log('debug', 'PageErrorComponent _init() invoked');

        this.errorCode = this._getErrorCode();

        this._route
            .params
            .pipe(
                concatMap((params: Params) => {
                    this.showErrorLog = environment.showError || false;

                    this._initError(params);

                    return this._globalErrorHandler.error$;
                }),
                takeUntil(this._stop$)
            )
            .subscribe((error: HttpErrorResponse | Error | null) => {
                this._logger.logGroup('error', 'error', 'PageErrorComponent _init() error', true, false, error);

                if (!error) {
                    return;
                }

                this.logError = error;
                this.isHttpError = error instanceof HttpErrorResponse;
                this.displayErrorMsg = this.logError && this.showErrorLog;
            });
    }

    login(): void {
        this._appAuth.loginRedirect();
    }

    back(): void {
        this._location.back();
    }

    tryAgain(): void {
        alert('Try again clicked');
    }

    close(): void {
        // Run this in with NgZone to fix issue with not closing err msg
        this._zone.run(() => {
            this.displayErrorMsg = false;
        });
    }

    protected _initError(params: Params): void {
        this.error = this._getPageError(params.id.toString()) || pageErrors.internalServerError;
        this.error.displayActionsBtns = this.error.displayActionsBtns === false ? false : true;

        this.error.titleKey &&
            this._labelsResourceExist.transform(this.error.titleKey) &&
            (this.error.title = this._labelsResources.transform(this.error.titleKey as string));

        this.error.textKey &&
            this._labelsResourceExist.transform(this.error.textKey) &&
            (this.error.text = this._labelsResources.transform(this.error.textKey as string));

        if (!this._sharer.isEmpty() && this._sharer.type === SharerTypes.applicationTextError) {
            this.error.text = this._sharer.data as string;
        }
    }

    protected _getPageError(code: string): IPageError | null {
        const codeUpper = code.toUpperCase();
        for (const key in pageErrors) {
            if (pageErrors.hasOwnProperty(key) && ((pageErrors as any)[key] as IPageError).code.toString().toUpperCase() === codeUpper) {
                return (pageErrors as any)[key];
            }
        }
        return null;
    }

    protected _getErrorCode(): string {
        return `${dayjs().format('MMDDYYHHmmss')}`;
    }
}
