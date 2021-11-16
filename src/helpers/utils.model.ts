/**
 * Corresponds to `Number.MAX_SAFE_INTEGER`. Moved out into a variable here due to
 * flaky browser support and the value not being defined in Closure's typings.
 */
export const MAX_SAFE_INTEGER = 9007199254740991;

export enum MobileOsEnum {
    windowsPhone = 'Windows Phone',
    android = 'Android',
    ios = 'iOS',
    unknown = 'unknown'
}

export enum OsEnums {
    mac = 'MacOS',
    ios = 'iOS',
    windows = 'Windows',
    android = 'Android',
    linux = 'Linux'
}

export const nameof = <T>(name: keyof T): string => name as string;
