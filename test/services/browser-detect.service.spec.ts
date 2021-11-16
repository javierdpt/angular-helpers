import { TestBed } from '@angular/core/testing';
import { BrowsersEnum } from '../../../src/app/core/browser-detect.model';
import { BrowserDetectService } from '../../../src/app/core/browser-detect.service';
import { WINDOW } from '../../../src/app/core/injection-token.service';
import { TestUtils } from '../../core/tests-utils.model.spec';

describe('app/core/BrowserDetectService', () => {
    let sut: BrowserDetectService;

    const init = (windowStub: Window = {
        navigator: {
            userAgent: '',
            appVersion: ''
        }
    } as Window): void => {
        TestBed.configureTestingModule({
            providers: [
                TestUtils.getValueProvider(WINDOW, windowStub)
            ]
        });
        sut = TestBed.inject(BrowserDetectService);
    };

    it('should be created', () => {
        // arrange

        // act
        init();

        // assert
        expect(sut).toBeTruthy();
    });

    describe('#constructor', () => {
        it('should init browser Chrome', () => {
            // arrange

            // act
            init({
                navigator: {
                    userAgent: 'something Chrome something else',
                    appVersion: ''
                } as Navigator
            } as Window);

            // assert
            expect(sut.browser).toBe(BrowsersEnum.chrome);
        });

        it('should init browser null', () => {
            // arrange

            // act
            init({
                navigator: {
                    userAgent: 'something nothing something else',
                    appVersion: ''
                } as Navigator
            } as Window);

            // assert
            expect(sut.browser).toBeNull();
        });

        it('should init version -1', () => {
            // arrange

            // act
            init();

            // assert
            expect(sut.version).toBe(-1);
        });

        it('should init version 100', () => {
            // arrange

            // act
            init({
                navigator: {
                    userAgent: 'something Chrome something else',
                    appVersion: 'Chrome/100'
                } as Navigator
            } as Window);

            // assert
            expect(sut.version).toBe(100);
        });

        it('should init version from userAgent', () => {
            // arrange

            // act
            init({
                navigator: {
                    userAgent: 'something Chrome/101 something else',
                    appVersion: 'Chrome/100'
                } as Navigator
            } as Window);

            // assert
            expect(sut.version).toBe(101);
        });

        it('should init version 99 for "Trident" using "rv:"', () => {
            // arrange

            // act
            init({
                navigator: {
                    userAgent: 'something Trident something else',
                    appVersion: 'rv:99'
                } as Navigator
            } as Window);

            // assert
            expect(sut.version).toBe(99);
        });
    });
});
