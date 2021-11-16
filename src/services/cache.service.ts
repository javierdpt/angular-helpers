import { Injectable } from '@angular/core';
import dayjs from 'dayjs';
import { ICacheItem, ICacheItemInfo, ICacheTimespam, StorageLoc } from './cache.model';


@Injectable({
    providedIn: 'root'
})
export class CacheService {
    set<T>(storageLoc: StorageLoc, key: string, item: T, expiresAt?: Date): void {
        this._getStorage(storageLoc).setItem(key, JSON.stringify({
            item,
            expiresAt,
            createdAt: new Date()
        }));
    }

    get<T>(storageLoc: StorageLoc, key: string): T | null {
        return this.getCacheItem<T>(storageLoc, key)?.item ?? null;
    }

    getInfo(storageLoc: StorageLoc, key: string): ICacheItemInfo | null {
        const cachedItem = this.getCacheItem<any>(storageLoc, key);
        return cachedItem
            ? {
                createdAt: cachedItem.createdAt,
                expiresAt: cachedItem.expiresAt
            }
            : null;
    }

    getCacheItem<T>(storageLoc: StorageLoc, key: string): ICacheItem<T> | null {
        const cachedItem: ICacheItem<T> = JSON.parse(this._getStorage(storageLoc).getItem(key) as any, this._dateParse);
        if (cachedItem !== null && (!cachedItem.expiresAt || cachedItem.expiresAt > new Date())) {
            return cachedItem;
        }
        this.remove(storageLoc, key);
        return null;
    }

    remove(storageLoc: StorageLoc, key: string): void {
        this._getStorage(storageLoc).removeItem(key);
    }

    isWithinBuffer(storageLoc: StorageLoc, key: string, cacheBuffer: ICacheTimespam): boolean {
        const cacheInfo = this.getInfo(storageLoc, key);

        return !!cacheInfo &&
            dayjs(cacheInfo.createdAt.getTime())
                .add(cacheBuffer.value, cacheBuffer.unit)
                .toDate() >= new Date();
    }

    private _getStorage(storage: StorageLoc | null): Storage {
        switch (storage) {
            case StorageLoc.session:
                return sessionStorage;
            default:
                return localStorage;
        }
    }

    private _dateParse(_key: string, value: any): any {
        const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
        const reMsAjax = /^\/Date\((d|-|.*)\)[\/|\\]$/;
        if (typeof value === 'string') {
            let matched = reISO.exec(value);
            if (matched) {
                return new Date(value);
            }

            matched = reMsAjax.exec(value);
            if (matched) {
                const datesVal = matched[1].split(/[-+,.]/);
                return new Date(datesVal[0] ? +datesVal[0] : 0 - +datesVal[1]);
            }
        }
        return value;
    }
}
