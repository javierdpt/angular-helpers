import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideModalComponent } from './side-modal.component';
import { SideModalService } from './side-modal.service';
import { SideModalComponentAnchorDirective } from './side-modal-component-anchor.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        SideModalComponent,
        SideModalComponentAnchorDirective
    ],
    exports: [
        SideModalComponent,
        SideModalComponentAnchorDirective
    ],
    providers: [
        SideModalService
    ]
})
export class SideModalModule { }
