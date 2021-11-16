import { Injectable } from '@angular/core';
import { StorageLoc } from '../../core/cache.model';
import { CacheService } from '../../core/cache.service';
import { LoggerService } from '../../core/logger.service';
import { PersistentValue } from '../../models/persistent-value.model';
import { IFilterData } from './dynamic-filter.model';


@Injectable({
    providedIn: 'root'
})
export class DynamicFilterDataService extends PersistentValue<{ [key: string]: IFilterData }> {
    constructor(logger: LoggerService, cache: CacheService) {
        super(logger, cache, StorageLoc.local, 'grm-ui-filter-store', { unit: 'day', value: 5 }, {});
    }

    get(): IFilterData {
        const val = this._getDataValSave(this._get('data'));

        if (!val[this._getCurrentPathName()]) {
            val[this._getCurrentPathName()] = {
                displayed: false,
                terms: {
                    global: null,
                    specifics: {}
                }
            };
            this._set('data', val);
        }

        return val[this._getCurrentPathName()];
    }

    set(setter: (filterInfo: IFilterData) => void): void {
        this.updateClonedReferenceProp(
            'data',
            (prop: { [key: string]: IFilterData } | null) => {
                prop && setter(prop[this._getCurrentPathName()]);
            }
        );
    }

    reset(): void {
        this._reset();
    }

    private _getCurrentPathName(): string {
        return location.pathname;
    }

    private _getDataValSave(data: { [key: string]: IFilterData } | null): { [key: string]: IFilterData } {
        return data ?? {};
    }
}
