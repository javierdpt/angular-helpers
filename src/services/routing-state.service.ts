import { Injectable } from '@angular/core';
import {
    ActivatedRoute, Data,
    Event, NavigationEnd, NavigationStart,
    PRIMARY_OUTLET, Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoutingStateService {
    currentRouteData!: Observable<Data>;
    history: Array<NavigationStart> = [];
    private _keep = 20;

    init(router: Router, activatedRoute: ActivatedRoute, keep?: number): void {
        keep && (this._keep = keep);
        router.events
            .pipe(
                filter(event => event instanceof NavigationStart)
            )
            .subscribe((event: Event) => {
                if (this.history.length >= this._keep) {
                    this.history.pop();
                }
                this.history.unshift(event as NavigationStart);
            });

        this.currentRouteData = router.events
            .pipe(
                filter((event: Event) => event instanceof NavigationEnd),
                map(() => activatedRoute),
                map((route: ActivatedRoute) => {
                    while (route.firstChild) { route = route.firstChild; }
                    return route;
                }),
                filter((route: ActivatedRoute) => route.outlet === PRIMARY_OUTLET),
                mergeMap((route: ActivatedRoute) => route.data)
            );
    }
}
