import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEnvironmentSettings } from '../core/environment-ref.service';
import { LoggerService } from '../core/logger.service';
import { IRequestOptions, WebApiService } from './web-api-service.model';

export class WebApiRestService<TEntity> extends WebApiService {
    constructor(
        env: IEnvironmentSettings,
        http: HttpClient,
        logger: LoggerService,
        public resourceEndPoint: string,
        baseApiUrl?: string
    ) {
        super(env, http, logger, resourceEndPoint, baseApiUrl);
    }

    findAll(options?: IRequestOptions): Observable<TEntity[]> {
        return super.get<TEntity[]>(undefined, options);
    }

    findById(
        id: any,
        options: IRequestOptions
    ): Observable<TEntity> {
        return super.get<TEntity>(id, options);
    }

    save(entity: TEntity, entityIdName?: string, options?: IRequestOptions): Observable<TEntity> {
        if (entityIdName && (entity as any)[entityIdName] || (entity as any).id || (entity as any).Id) {
            return this.put<TEntity, TEntity>(entity,
                (entity as any)[entityIdName ?? 'id'] || (entity as any).id || (entity as any).Id, options);
        }
        return this.post<TEntity, TEntity>(entity, undefined, options);
    }
}
