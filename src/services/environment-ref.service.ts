import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export interface IEnvironmentSettings {
    readonly production: boolean;
    readonly test: boolean;
    readonly appEnvironment: AppEnvironment;
    readonly instrumentationKey: string;
    readonly showError: boolean;
    readonly sessionDuration: number;
    readonly apiEndpoint: string;
    readonly internationalization: {
        baseEndpoint: string;
        langEndpoints: { en: string; es: string; ja: string };
    };
    readonly authentication: {
        baseUrl: string;
        issuer: string;
        clientId: string;
        scopes: string;
    };

    readonly locales: string;
}

export const ENVIRONMENT = new InjectionToken<IEnvironmentSettings>('Environment object ref injection token', {
    providedIn: 'root',
    factory: (): IEnvironmentSettings => environment
});

export type AppEnvironment = 'local' | 'dev' | 'model' | 'prod';
