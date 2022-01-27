import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[sideModalHost]',
    exportAs: 'sideModalHost'
})
export class SideModalComponentAnchorDirective {

    constructor(public readonly viewContainerRef: ViewContainerRef) { }
}
