import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute, Event, NavigationEnd, NavigationStart, PRIMARY_OUTLET, Router } from '@angular/router';
import { BehaviorSubject, interval, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { RoutingStateService } from '../../../src/app/core/routing-state.service';

describe('app/core/RoutingStateService', () => {
    let sut: RoutingStateService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        sut = TestBed.inject(RoutingStateService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#init', () => {
        it('should add up to 20 history events when keep is not specified', fakeAsync(() => {
            // arrange
            const router = {
                events: interval(50).pipe(
                    map(i => new NavigationStart(i, 'url')),
                    take(30))
            } as Router;
            const activatedRoute = new ActivatedRoute();

            // act
            sut.init(router, activatedRoute);
            tick(50 * 30);

            // assert
            expect(sut.history.length).toBe(20);
        }));

        it('should add up to 10 history events when keep is 10', fakeAsync(() => {
            // arrange
            const router = {
                events: interval(50).pipe(
                    map(i => new NavigationStart(i, 'url')),
                    take(30))
            } as Router;
            const activatedRoute = new ActivatedRoute();

            // act
            sut.init(router, activatedRoute, 10);
            tick(50 * 30);

            // assert
            expect(sut.history.length).toBe(10);
        }));

        it('should init data with route data last first child when NavigationEnd', (done: DoneFn) => {
            // arrange
            const router = {
                events: new BehaviorSubject<Event>(new NavigationEnd(1, 'url', 'url2')) as any
            } as Router;
            const activatedRoute = {
                firstChild: {
                    firstChild: null,
                    outlet: PRIMARY_OUTLET,
                    data: of({ title: 'Title' })
                }
            } as unknown as ActivatedRoute;

            // act
            sut.init(router, activatedRoute);

            // assert
            sut.currentRouteData.subscribe((d) => {
                expect(d).toEqual({ title: 'Title' });
                done();
            });
        });
    });
});
