import { animate, style, transition, trigger } from '@angular/animations';

export const slideInOutAnimation =
    trigger('slideInOutAnimation', [
        transition(':enter', [
            style({
                opacity: 0,
                transform: 'translateY(-4%)'
            }),
            animate('.2s ease-in')
        ]),
        transition(':leave', [
            style({
                opacity: 1
            }),
            animate('.2s ease-out', style({
                opacity: 0,
                transform: 'translateY(4%)'
            }))
        ])
    ]);
