import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';
import { IEnvironmentSettings } from '../core/environment-ref.service';
import { LoggerService } from '../core/logger.service';
import { HttpStatusCodeEnum } from '../models/http-status-codes-enum';

export interface IRequestOptionsRetry {
    /**
     * Number of attempts
     */
    attempts: number;
    /**
     * Delay operation
     * Observable to execute when a fails happen (interval should be used to wait before retrying)
     */
    delayOp: (status?: HttpStatusCodeEnum, i?: number) => Observable<any>;
    /**
     * Http status codes when to apply the retry
     */
    statusCodes: HttpStatusCodeEnum[];
}

export interface IRequestOptions {
    params?: HttpParams;
    headers?: {
        [key: string]: string;
    };
    jsonContentType?: boolean;
    responseType?: 'arraybuffer' | 'json' | 'blob' | 'text';
    /**
     * Retry options
     */
    retry?: IRequestOptionsRetry;
}

export class WebApiService {
    private _cname = 'WebApiService';

    constructor(
        protected _env: IEnvironmentSettings,
        protected http: HttpClient,
        protected _logger: LoggerService,
        public resourceEndPoint: string,
        public baseApiUrl?: string
    ) { }

    get<TResponse>(
        resource?: string,
        options?: IRequestOptions
    ): Observable<TResponse> {
        return this._getHttpRequest(this._joinUrls(this.resourceEndPoint, resource), options);
    }

    post<TEntity, TResponse>(
        entity: TEntity,
        resource?: string,
        options?: IRequestOptions
    ): Observable<TResponse> {
        return this._postHttpRequest<TEntity, TResponse>(
            this._joinUrls(this.resourceEndPoint, resource),
            entity,
            options);
    }

    put<TEntity, TResponse>(
        entity: TEntity,
        resource?: string,
        options?: IRequestOptions
    ): Observable<TResponse> {
        return this._putHttpRequest<TEntity, TResponse>(
            this._joinUrls(this.resourceEndPoint, resource),
            entity,
            options);
    }

    delete<TResponse>(
        body?: any,
        resource?: string,
        options?: IRequestOptions
    ): Observable<HttpEvent<TResponse>> {
        return this._deleteHttpRequest(
            this._joinUrls(this.resourceEndPoint, resource),
            body,
            options);
    }

    protected _getHttpRequest<TResponse>(
        resourceEndPoint: string,
        options?: IRequestOptions
    ): Observable<TResponse> {
        const reqUrl = this._getRequestUrl(resourceEndPoint);
        const reqOptions = this._getRequestOptions(options);

        this._logger.logGroup(
            'info', 'info', this._cname + ' GET', true, false,
            JSON.stringify(reqUrl, null, 2), JSON.stringify(reqOptions, null, 2)
        );

        const req = this.http.get<TResponse>(reqUrl, reqOptions) as any;

        if (!options || !options.retry) {
            return req;
        }
        return this._retry(options.retry, req);
    }

    protected _postHttpRequest<TEntity, TResponse>(
        resourceEndPoint: string,
        entity: TEntity,
        options?: IRequestOptions
    ): Observable<TResponse> {
        const reqUrl = this._getRequestUrl(resourceEndPoint);
        const reqOptions = this._getRequestOptions(options);
        const body = entity instanceof FormData
            ? entity
            : JSON.stringify(entity);

        this._logger.logGroup(
            'info', 'info', this._cname + ' POST', true, false, reqUrl,
            JSON.stringify(reqOptions, null, 2), JSON.stringify(body, null, 2)
        );

        const req = this.http.post<TResponse>(reqUrl, body, reqOptions) as any;

        if (!options || !options.retry) {
            return req;
        }
        return this._retry(options.retry, req);
    }

    protected _putHttpRequest<TEntity, TResponse>(
        resourceEndPoint: string,
        entity: TEntity,
        options?: IRequestOptions
    ): Observable<TResponse> {
        const reqUrl = this._getRequestUrl(resourceEndPoint);
        const reqOptions = this._getRequestOptions(options);
        const body = entity instanceof FormData
            ? entity
            : JSON.stringify(entity);

        this._logger.logGroup(
            'info', 'info', this._cname + ' PUT', true, false, reqUrl,
            JSON.stringify(reqOptions, null, 2), JSON.stringify(body, null, 2)
        );

        const req = this.http.put<TResponse>(
            reqUrl,
            body,
            reqOptions
        ) as any;

        if (!options || !options.retry) {
            return req;
        }
        return this._retry(options.retry, req);
    }

    protected _deleteHttpRequest<TResponse>(
        resourceEndPoint: string,
        body?: any,
        options?: IRequestOptions
    ): Observable<HttpEvent<TResponse>> {
        const reqUrl = this._getRequestUrl(resourceEndPoint);
        const reqOptions = this._getRequestOptions(options);
        if (body) {
            reqOptions.body = body;
        }

        this._logger.logGroup('info', 'info', this._cname + ' DELETE', true, false, reqUrl,
            JSON.stringify(reqOptions, null, 2), JSON.stringify(body, null, 2)
        );

        const req = this.http.delete<TResponse>(reqUrl, reqOptions);

        if (!options || !options.retry) {
            return req;
        }
        return this._retry(options.retry, req);
    }

    /**
     * Retries a failed http call
     *
     * @param retryOpt retry options of type IRequestOptionsRetry
     * @param req the observable to be executed when retry (interval should be used to wait between retries)
     */
    protected _retry<T>(retryOpt: IRequestOptionsRetry, req: Observable<T>): Observable<T> {
        return req.pipe(
            retryWhen((attempt: Observable<HttpErrorResponse>) => attempt
                .pipe(
                    mergeMap((error: HttpErrorResponse, i: number) => {
                        this._logger.log('debug',
                            `${this._cname} _retry() - status: ${error.status} ` +
                            `| attempt: ${i + 1} of ${retryOpt.attempts} ` +
                            `| statusCodes: ${JSON.stringify(retryOpt.statusCodes)}`);

                        if (
                            (i + 1) > retryOpt.attempts ||
                            !retryOpt.statusCodes.some(statusCode => error.status === statusCode)
                        ) { return throwError(error); }
                        return retryOpt.delayOp(error.status, i);
                    })
                ))
        );
    }

    protected _getRequestUrl(resourceEndPoint: string): string {
        const baseUrl = this.baseApiUrl === undefined ? this._env.apiEndpoint : this.baseApiUrl;
        return this._joinUrls(baseUrl, resourceEndPoint);
    }

    protected _joinUrls(
        left: string | null | undefined,
        right: string | null | undefined
    ): string {
        return [left, right]
            .filter((urlChunk: string | null | undefined) => !!urlChunk)
            .join('/');
    }

    protected _getRequestOptions(options?: IRequestOptions): any {
        // Ensure defaults
        if (!options) {
            options = {
                params: undefined,
                headers: {},
                jsonContentType: true,
                responseType: 'json'
            };
        } else {
            options.headers = !options.headers ? {} : options.headers;
            options.jsonContentType = options.jsonContentType === undefined ? true : options.jsonContentType;
            options.responseType = !options.responseType ? 'json' : options.responseType;
        }

        options = options as {
            params?: HttpParams;
            headers: {
                [key: string]: string;
            };
            jsonContentType: boolean;
            responseType: 'arraybuffer' | 'json' | 'blob' | 'text';
            retry?: IRequestOptionsRetry;
        };

        if (options.jsonContentType === true && options.headers) {
            options.headers['Content-Type'] = 'application/json';
        }

        const optionsRes = {
            params: options.params,
            headers: new HttpHeaders(),
            responseType: options.responseType
        };
        Object.keys(options!.headers!)
            .filter(k => options!.headers!.hasOwnProperty(k))
            .forEach(k => optionsRes.headers =
                optionsRes.headers.append(k, options!.headers![k]));

        return optionsRes;
    }
}
