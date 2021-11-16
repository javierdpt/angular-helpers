import { ViewContainerRef } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SideModalComponent } from './side-modal.component';
import { ComponentType, SideModalConfig } from './side-modal.model';

export class SideModalRef<T, D, R> {
    sideModalComponentRef?: SideModalComponent;
    private _afterOpened$ = new Subject<void>();
    private _afterClosed$ = new Subject<R | undefined>();
    private _onClose$ = new Subject<R | undefined>();

    constructor(
        public componentType: ComponentType<T>,
        public viewContainerRef: ViewContainerRef,
        public configs: SideModalConfig<D>
    ) {
    }

    close(dialogResult?: R): void {
        this.sideModalComponentRef && this.sideModalComponentRef.hide();
        this._onClose$.next(dialogResult);
        timer(500).subscribe(() => {
            this.viewContainerRef.clear();
            this._afterClosed$.next(dialogResult);
        });
    }

    onClose(until$: Observable<void>): Observable<R | undefined> {
        return this._onClose$.pipe(takeUntil(until$));
    }

    opened(): void {
        this._afterOpened$.next();
    }

    afterOpened(until$: Observable<void>): Observable<void> {
        return this._afterOpened$.pipe(takeUntil(until$));
    }

    afterClosed(until$: Observable<void>): Observable<R | undefined> {
        return this._afterClosed$.pipe(takeUntil(until$));
    }
}
