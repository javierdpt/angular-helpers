import { TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ENVIRONMENT, IEnvironmentSettings } from '../../../src/app/core/environment-ref.service';
import { MonitoringService } from '../../../src/app/core/monitor.service';
import { AngularCoreMocks } from '../../core/angular-core-stubs.model.spec';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/MonitoringService', () => {
    let sut: MonitoringService;
    let routerEvents: Subject<Event>;

    beforeEach(() => {
        const routerMocks = AngularCoreMocks.getRouterStub();
        routerEvents = routerMocks.eventsSubj;

        TestBed.configureTestingModule({
            providers: [
                TestUtils.getValueProvider(ENVIRONMENT, { instrumentationKey: '12345' } as IEnvironmentSettings),
                TestUtils.getValueProvider(Router, routerMocks.stub)
            ]
        });
        sut = TestBed.inject(MonitoringService);
    });

    it('should be created', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });

    it('#trackEvent should call appInsights.trackEvent', () => {
        // arrange
        const trackEventSpy = spyOn(sut.appInsights, 'trackEvent');

        // act
        sut.trackEvent('name');

        // assert
        expect(trackEventSpy).toHaveBeenCalled();
    });

    it('#trackPageView should call appInsights.trackPageView', () => {
        // arrange
        const trackPageViewSpy = spyOn(sut.appInsights, 'trackPageView');

        // act
        sut.trackPageView();

        // assert
        expect(trackPageViewSpy).toHaveBeenCalled();
    });

    it('#trackMetric should call appInsights.trackMetric', () => {
        // arrange
        const trackMetricSpy = spyOn(sut.appInsights, 'trackMetric');

        // act
        sut.trackMetric('name', 1);

        // assert
        expect(trackMetricSpy).toHaveBeenCalled();
    });

    it('#trackException should call appInsights.trackException', () => {
        // arrange
        const trackExceptionSpy = spyOn(sut.appInsights, 'trackException');

        // act
        sut.trackException({});

        // assert
        expect(trackExceptionSpy).toHaveBeenCalled();
    });

    it('#trackTrace should call appInsights.trackTrace', () => {
        // arrange
        const trackTraceSpy = spyOn(sut.appInsights, 'trackTrace');

        // act
        sut.trackTrace({} as any);

        // assert
        expect(trackTraceSpy).toHaveBeenCalled();
    });

    it('should call appInsights.trackPageView when router.event emits a NavigationEnd', () => {
        // arrange
        const trackPageViewSpy = spyOn(sut.appInsights, 'trackPageView');

        // act
        routerEvents.next(new NavigationEnd(1, 'url', 'url2'));

        // assert
        expect(trackPageViewSpy).toHaveBeenCalled();
    });

    it('should not call appInsights.trackPageView when router.event emits a NavigationStart', () => {
        // arrange
        const trackPageViewSpy = spyOn(sut.appInsights, 'trackPageView');

        // act
        routerEvents.next(new NavigationStart(1, 'url'));

        // assert
        expect(trackPageViewSpy).not.toHaveBeenCalled();
    });
});
