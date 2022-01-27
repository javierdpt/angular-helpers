import { InjectionToken, ViewContainerRef } from '@angular/core';

export type DialogPosition = 'left' | 'right';

export type SideModalConfig<D = any> = {
    position: DialogPosition;
    viewContainerRef?: ViewContainerRef;
    panelClass?: string | string[];
    width?: string;
    minWidth?: number | string;
    maxWidth?: number | string;
    data?: D | null;
    closeOnNavigation?: boolean;
};

export type ComponentType<T = any> = new (...args: any[]) => T;

export const SIDE_MODAL_DATA = new InjectionToken<any>('SIDE_MODAL_DATA');
