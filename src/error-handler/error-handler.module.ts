import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { ErrorHandlerRoutingModule } from './error-handler-routing.module';
import { PageErrorComponent } from './page-error.component';

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,

        ErrorHandlerRoutingModule,
        SharedModule
    ],
    declarations: [PageErrorComponent],
})
export class ErrorHandlerModule { }
