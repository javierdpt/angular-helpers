import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

const getSlideInOutAnimation = (
    name: string,
    enterTranslate: string,
    leaveTranslate: string
): AnimationTriggerMetadata =>
    trigger(name, [
        transition(':enter', [
            style({
                opacity: 0,
                transform: `translateX(${enterTranslate})`
            }),
            animate('.3s ease-in')
        ]),
        transition(':leave', [
            style({
                opacity: 1
            }),
            animate('.3s ease-out', style({
                opacity: 0,
                transform: `translateX(${leaveTranslate})`
            }))
        ])
    ]);

export const slideInOutLeftToRightAnimation = getSlideInOutAnimation('slideInOutLeftToRightAnimation', '-100px', '-100px');

export const slideInOutRightToLeftAnimation = getSlideInOutAnimation('slideInOutRightToLeftAnimation', '100px', '100px');
