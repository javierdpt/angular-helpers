import { ComponentType } from '@angular/cdk/portal';
import { ApplicationRef, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { timer } from 'rxjs';
import { SideModalRef } from './side-modal-ref.model';
import { SideModalComponent } from './side-modal.component';
import { SideModalConfig, SIDE_MODAL_DATA } from './side-modal.model';

@Injectable()
export class SideModalService {
    constructor(
        private readonly _injector: Injector,
        private readonly _applicationRef: ApplicationRef

    ) { }

    open<T, D = any, R = any>(options: {
        componentType: ComponentType<T>;
        configs: SideModalConfig<D>;
    }): SideModalRef<T, D, R> {
        if (!options.configs.viewContainerRef) {
            options.configs.viewContainerRef = this._applicationRef.components[0].injector.get(ViewContainerRef);
        }

        const sideModalRef = new SideModalRef<T, D, R>(
            options.componentType,
            options.configs.viewContainerRef,
            options.configs);

        const componentInjector = Injector.create({
            name: 'SideModalInnerComponentInjector',
            parent: this._injector,
            providers: [
                { provide: SIDE_MODAL_DATA, useValue: options.configs.data },
                { provide: SideModalRef, useValue: sideModalRef }
            ]
        });

        this.viewContRefHideScrollBars(options.configs);

        const componentRef = options.configs.viewContainerRef
            .createComponent(SideModalComponent, { injector: componentInjector });

        componentRef.instance.componentType = options.componentType;
        componentRef.instance.configs = options.configs;

        sideModalRef.sideModalComponentRef = componentRef.instance;
        return sideModalRef;
    }

    viewContRefHideScrollBars<D = any>(configs: SideModalConfig<D>, animationTime: number = 300): void {
        const parentElement = (configs.viewContainerRef?.element?.nativeElement as HTMLElement)?.parentElement;
        if (!parentElement) { return; }
        const parentCurrOverflow = parentElement.style.overflow;
        parentElement.style.overflow = 'hidden';
        timer(animationTime + 200).subscribe(() => {
            parentElement!.style.overflow = parentCurrOverflow;
        });
    }
}
