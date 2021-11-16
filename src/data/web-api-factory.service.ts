import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ENVIRONMENT, IEnvironmentSettings } from '../core/environment-ref.service';
import { LoggerService } from '../core/logger.service';
import { WebApiRestService } from './web-api-rest-service.model';
import { WebApiService } from './web-api-service.model';

@Injectable({
    providedIn: 'root'
})
export class WebApiFactoryService {
    private _restApiInstances: {
        [key: string]: WebApiRestService<any>;
    };

    private _apiInstances: {
        [key: string]: WebApiService;
    };

    constructor(
        @Inject(ENVIRONMENT) private readonly _env: IEnvironmentSettings,
        private readonly _http: HttpClient,
        private readonly _logger: LoggerService
    ) {
        this._restApiInstances = {};
        this._apiInstances = {};
    }

    getRestInstance<T>(apiResourceEndPoint: string, baseApiUrl?: string): WebApiRestService<T> {
        const cacheKey = this._getInstanceKey(baseApiUrl, apiResourceEndPoint);
        if (!this._restApiInstances[cacheKey]) {
            this._restApiInstances[cacheKey] =
                new WebApiRestService<T>(
                    this._env,
                    this._http,
                    this._logger,
                    apiResourceEndPoint,
                    baseApiUrl);
        }
        return this._restApiInstances[cacheKey];
    }

    getApiInstance(apiResourceEndPoint: string, baseApiUrl?: string): WebApiService {
        const cacheKey = this._getInstanceKey(baseApiUrl, apiResourceEndPoint);
        if (!this._apiInstances[cacheKey]) {
            this._apiInstances[cacheKey] =
                new WebApiService(
                    this._env,
                    this._http,
                    this._logger,
                    apiResourceEndPoint,
                    baseApiUrl);
        }
        return this._apiInstances[cacheKey];
    }

    private _getInstanceKey(baseApiUrl: string | undefined, apiResourceEndPoint: string): string {
        return `${baseApiUrl ?? this._env.apiEndpoint}/${apiResourceEndPoint}`;
    }
}
