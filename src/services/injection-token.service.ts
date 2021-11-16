import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window>('Window object ref injection token', {
    providedIn: 'root',
    factory: (): Window => window
});

export const CONSOLE = new InjectionToken<Console>('Console object ref injection token', {
    providedIn: 'root',
    factory: (): Console => console
});
