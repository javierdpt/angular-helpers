import { TestBed } from '@angular/core/testing';
import { CONSOLE, WINDOW } from '../../../src/app/core/injection-token.service';

describe('core/WINDOW', () => {
    let sut: Window;

    beforeEach(() => {
        TestBed.configureTestingModule({

        });
        sut = TestBed.inject(WINDOW);
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});

describe('core/CONSOLE', () => {
    let sut: Console;

    beforeEach(() => {
        TestBed.configureTestingModule({

        });
        sut = TestBed.inject(CONSOLE);
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
