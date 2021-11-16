import { OpUnitType } from 'dayjs';

export enum StorageLoc {
    local,
    session
}

export interface ICacheItemInfo {
    expiresAt: Date;
    createdAt: Date;
}

export interface ICacheItem<T> extends ICacheItemInfo {
    item: T;
}

export interface ICacheTimespam {
    value: number;
    unit: OpUnitType;
}
