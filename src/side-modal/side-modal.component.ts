import { AfterViewInit, Component, HostBinding, Injector, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppThemesEnum, ThemeService } from '../../core/theme.service';
import { BaseUnsubscribeComponent } from '../../models/base-unsubscribe-component.model';
import { SideModalComponentAnchorDirective } from './side-modal-component-anchor.directive';
import { SideModalRef } from './side-modal-ref.model';
import { slideInOutLeftToRightAnimation, slideInOutRightToLeftAnimation } from './side-modal.animations';
import { ComponentType, SideModalConfig } from './side-modal.model';
import { SideModalService } from './side-modal.service';

@Component({
    selector: 'app-side-modal',
    templateUrl: './side-modal.component.html',
    styleUrls: ['./side-modal.component.scss'],
    animations: [slideInOutLeftToRightAnimation, slideInOutRightToLeftAnimation]
})
export class SideModalComponent extends BaseUnsubscribeComponent implements OnInit, AfterViewInit {
    @ViewChild(SideModalComponentAnchorDirective, { static: false }) sideModalComponentAnchor!: SideModalComponentAnchorDirective;

    componentType!: ComponentType;
    configs!: SideModalConfig;

    hidden = false;
    sideModalContainerStyles!: { [key: string]: string | number };

    appTheme$: Observable<AppThemesEnum>;
    appThemesEnum = AppThemesEnum;

    constructor(
        theme: ThemeService,
        private readonly _injector: Injector,
        private readonly _router: Router,
        private readonly _sideModal: SideModalService,
        private readonly _sideModalRef: SideModalRef<any, any, any>
    ) {
        super();
        this.appTheme$ = theme.appTheme$;
    }

    @HostBinding('class') get classes(): string {
        return [
            'jd-side-modal',
            this.configs.panelClass
        ].filter(c => !!c).join(' ');
    }

    ngOnInit(): void {
        if (!this.componentType || !this.configs) {
            throw new TypeError('The "componentType" and "configs" are required.');
        }

        this._initSideModalContainerStyles();
        this._setupCloseOnNavigation();
    }

    ngAfterViewInit(): void {
        const componentRef = this.sideModalComponentAnchor
            .viewContainerRef
            .createComponent(this.componentType, {
                injector: this._injector
            });

        componentRef.changeDetectorRef.detectChanges();
        this._sideModalRef.opened();
    }

    hide(): void {
        this._sideModal.viewContRefHideScrollBars(this.configs);
        this.hidden = true;
    }

    private _initSideModalContainerStyles(): void {
        this.sideModalContainerStyles = {
            width: this.configs.width ?? '400px'
        };
        this.configs.minWidth && (this.sideModalContainerStyles['min-width'] = this.configs.minWidth);
        this.configs.maxWidth && (this.sideModalContainerStyles['max-width'] = this.configs.maxWidth);
    }

    private _setupCloseOnNavigation(): void {
        this._router.events
            .pipe(
                filter((event: Event) => (event instanceof NavigationStart) && !!this.configs.closeOnNavigation),
                takeUntil(this._stop$)
            )
            .subscribe(() => this._sideModalRef.close());
    }
}
