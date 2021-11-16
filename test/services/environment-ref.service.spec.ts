import { TestBed } from '@angular/core/testing';
import { ENVIRONMENT, IEnvironmentSettings } from '../../../src/app/core/environment-ref.service';

describe('core/ENVIRONMENT', () => {
    let sut: IEnvironmentSettings;

    beforeEach(() => {
        TestBed.configureTestingModule({

        });
        sut = TestBed.inject(ENVIRONMENT);
    });

    it('should create', () => {
        // arrange

        // act

        // assert
        expect(sut).toBeTruthy();
    });
});
