import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TitledRouteData } from '../../models/shared.model';
import { PageErrorComponent } from './page-error.component';

const routes: Routes = [
    {
        path: 'error/:id',
        component: PageErrorComponent,
        data: {
            title: 'Error'
        } as TitledRouteData
    },
    {
        path: 'info/:id',
        component: PageErrorComponent,
        data: {
            title: 'Info'
        } as TitledRouteData
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: []
})
export class ErrorHandlerRoutingModule { }
