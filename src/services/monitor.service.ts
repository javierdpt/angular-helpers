import { Inject, Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import * as Common from '@microsoft/applicationinsights-common';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { filter } from 'rxjs/operators';
import { ENVIRONMENT, IEnvironmentSettings } from './environment-ref.service';

@Injectable({
    providedIn: 'root'
})
export class MonitoringService {
    appInsights!: ApplicationInsights;

    constructor(router: Router, @Inject(ENVIRONMENT) env: IEnvironmentSettings) {
        this._init(router, env);
    }

    trackPageView(
        name?: string, url?: string, properties?: any,
        measurements?: any): void {
        this.appInsights.trackPageView({
            name,
            uri: url,
            properties,
            measurements
        });
    }

    trackEvent(name: string, properties?: { [key: string]: any }): void {
        this.appInsights.trackEvent({ name }, properties);
    }

    trackMetric(name: string, average: number, properties?: { [key: string]: any }): void {
        this.appInsights.trackMetric({ name, average }, properties);
    }

    trackException(exception: Common.IExceptionTelemetry): void {
        this.appInsights.trackException(exception);
    }

    trackTrace(trace: Common.ITraceTelemetry, customProperties?: { [key: string]: string }): void {
        this.appInsights.trackTrace(trace, customProperties);
    }

    private _init(router: Router, env: IEnvironmentSettings): void {
        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: env.instrumentationKey,
                enableAutoRouteTracking: true
            }
        });

        this.appInsights.config && this.appInsights.loadAppInsights();

        router.events
            .pipe(filter((event: Event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.trackPageView();
            });
    }
}
